import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserGrowthOverTime = async (req, res) => {
  try {
    const users = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: {
        user_id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const result = users.map((user) => ({
      month: user.createdAt.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      userCount: user._count.user_id,
    }));

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