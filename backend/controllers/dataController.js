import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserGrowthOverTime = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        createdAt: true,
      },
    });

    const userCounts = {};

    users.forEach(user => {
      const monthYear = new Date(user.createdAt).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!userCounts[monthYear]) {
        userCounts[monthYear] = 0;
      }
      userCounts[monthYear]++;
    });

    const result = Object.entries(userCounts).map(([month, userCount]) => ({
      month,
      userCount,
    }));

    result.sort((a, b) => new Date(a.month) - new Date(b.month));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user growth data" });
  }
};

export const getUsersByDepartment = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: {
            user_id: true,
          },
        },
      },
    });

    const result = departments.map((department) => ({
      departmentName: department.dept_name,
      userCount: department.users.length,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users by department data" });
  }
};


// Gets the number of users in each department have each skill.
export const getSkillsDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        skillDepartments: {
          include: {
            skill: {
              select: {
                skill_name: true,
              },
            },
          },
        },
        users: {
          include: {
            skills: {
              include: {
                skill: {
                  select: {
                    skill_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = departments.map((department) => ({
      departmentName: department.dept_name,
      skills: department.skillDepartments.map((skillDept) => {
        const usersWithSkill = department.users.filter(user =>
          user.skills.some(userSkill => userSkill.skill.skill_name === skillDept.skill.skill_name)
        ).length;

        return {
          skillName: skillDept.skill.skill_name,
          usersWithSkill,
        };
      }),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving skill distribution data" });
  }
};

// Gets the number of users enrolled in courses, grouped by department
export const getCourseDepartment = async (req, res) => {
  try {
    const courseDepartments = await prisma.courseDepartment.findMany({
      include: {
        course: {
          include: {
            courseUsers: {
              select: {
                user_id: true,
              },
            },
          },
        },
        department: {
          select: {
            dept_name: true,
          },
        },
      },
    });

    const result = courseDepartments.reduce((acc, courseDept) => {
      const departmentName = courseDept.department.dept_name;
      const courseName = courseDept.course.course_name;
      const enrolledUsers = courseDept.course.courseUsers.length;

      // Group by department
      const department = acc.find(dep => dep.departmentName === departmentName);
      if (department) {
        department.courses.push({ courseName, enrolledUsers });
      } else {
        acc.push({
          departmentName,
          courses: [{ courseName, enrolledUsers }],
        });
      }
      return acc;
    }, []);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving course enrollment data" });
  }
};

export const getUserSkillsInfo = async (req, res) => {
  try {
    let { userId } = req.params; 
    userId = parseInt(userId);
    
    // 1. Check if the user exists and get their dept_id
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        dept_id: true,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const { dept_id } = user;

    // 2. Get all skills associated with this department from SkillDepartment
    const departmentSkills = await prisma.skillDepartment.findMany({
      where: {
        dept_id,
      },
      include: {
        skill: true,
      },
    });

    if (departmentSkills.length === 0) {
      return res
        .status(404)
        .json({ message: "No skills found for this department" });
    }

    // 3. Get the user's competency level for each skill, if it exists in SkillUsers
    const skillsInfo = await Promise.all(
      departmentSkills.map(async (deptSkill) => {
        const skill_id = deptSkill.skill.skill_id;

        const userSkill = await prisma.skillUsers.findUnique({
          where: {
            skill_id_user_id: { skill_id, user_id: userId },
          },
        });

        return {
          skill_id: skill_id,
          skill_name: deptSkill.skill.skill_name,
          competency: userSkill ? userSkill.competency : null,
        };
      })
    );

    return res.status(200).json(skillsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving skills information" });
  }
};



export const getUserCoursesInfo = async (req, res) => {
  try {
    let { userId } = req.params; 
    userId = parseInt(userId);

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { dept_id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const dept_id = user.dept_id; 

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          {
            courseUsers: {
              some: {
                user_id: userId,
              },
            },
          },
          {
            courseDepartments: {
              some: {
                department: {
                  dept_id: dept_id, 
                },
              },
            },
            courseUsers: {
              none: {
                user_id: userId, 
              },
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        courseUsers: {
          where: {
            user_id: userId,
          },
          select: {
            user_score: true,
          },
        },
      },
    });

    const result = courses.map((course) => ({
      course_id: course.course_id,
      course_name: course.course_name,
      course_desc: course.course_desc,
      course_creator: `${course.creator.first_name} ${course.creator.last_name}`,
      course_img: course.course_img,
      user_score: course.courseUsers.length > 0 ? course.courseUsers[0].user_score : null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving course information" });
  }
};