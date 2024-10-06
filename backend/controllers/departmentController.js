import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDepartmentsWithInfo = async (req, res) => {
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
      id: department.dept_id,
      name: department.dept_name,
      totalPeople: department.users.length,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving departments" });
  }
};

export const addDepartment = async (req, res) => {
  const { dept_name } = req.body;

  try {
    if (dept_name.toLowerCase() === "manager") {
      return res.status(403).json({
        error: 'Unauthorized to create or modify the "Manager" department',
      });
    }

    const existingDepartment = await prisma.department.findFirst({
      where: {
        dept_name: {
          equals: dept_name,
          mode: "insensitive",
        },
      },
    });

    if (existingDepartment) {
      return res.status(400).json({ error: "Department name already exists" });
    }

    // Create a new department if it doesn't exist
    const newDepartment = await prisma.department.create({
      data: {
        dept_name,
      },
    });

    return res.status(201).json({
      message: "Department added successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the department" });
  }
};

export const updateDepartment = async (req, res) => {
  const { dept_id, dept_name } = req.body;

  try {
    if (!dept_name.trim()) {
      return res.status(403).json({ error: "department name is found empty" });
    }

    const existingDepartment = await prisma.department.findUnique({
      where: {
        dept_id: dept_id,
      },
    });

    if (!existingDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    if (existingDepartment.dept_name.toLowerCase() === "manager") {
      return res
        .status(403)
        .json({ error: 'Unauthorized to modify the "Manager" department' });
    }

    const duplicateDepartment = await prisma.department.findFirst({
      where: {
        dept_name: {
          equals: dept_name,
          mode: "insensitive",
        },
      },
    });

    if (duplicateDepartment) {
      return res.status(400).json({ error: "Department name already exists" });
    }

    const updatedDepartment = await prisma.department.update({
      where: {
        dept_id: dept_id,
      },
      data: {
        dept_name,
      },
    });

    return res.status(200).json({
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the department" });
  }
};

export const getDepartmentUsers = async (req, res) => {
  const { deptId } = req.params;

  try {
    const department = await prisma.department.findUnique({
      where: {
        dept_id: parseInt(deptId),
      },
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const formattedUsers = department.users.map((user) => ({
      Id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    }));

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching department users:", error);
    return res.status(500).json({
      error: "An error occurred while fetching department users",
    });
  }
};

export const getAvgMarksCourses = async (req, res) => {
  const { deptId } = req.params;

  try {
    // Find all courses related to the department
    const departmentCourses = await prisma.courseDepartment.findMany({
      where: {
        dept_id: parseInt(deptId),
      },
      include: {
        course: true, // Include course details
      },
    });

    if (!departmentCourses.length) {
      return res
        .status(404)
        .json({ error: "No courses found for the department" });
    }

    // Get all users in the department
    const departmentUsers = await prisma.user.findMany({
      where: {
        dept_id: parseInt(deptId),
      },
      select: {
        user_id: true, // Only need the user_id for further querying
      },
    });

    const userIds = departmentUsers.map((user) => user.user_id);

    if (!userIds.length) {
      return res
        .status(404)
        .json({ error: "No users found for the department" });
    }

    // For each course, find the average score of the department's users
    const courseAverages = await Promise.all(
      departmentCourses.map(async (deptCourse) => {
        const { course_id, course } = deptCourse;

        // Find the scores of department users for this course
        const courseUsers = await prisma.courseUser.findMany({
          where: {
            course_id,
            user_id: {
              in: userIds, // Only include users from this department
            },
          },
          select: {
            user_score: true, // Only select the score
          },
        });

        // Calculate the average score
        const totalScore = courseUsers.reduce(
          (sum, user) => sum + user.user_score,
          0
        );
        const avgScore = courseUsers.length
          ? totalScore / courseUsers.length
          : 0;

        return {
          course_name: course.course_name,
          average_score: avgScore,
        };
      })
    );

    return res.status(200).json(courseAverages);
  } catch (error) {
    console.error("Error fetching course averages for department:", error);
    return res.status(500).json({
      error: "An error occurred while fetching course averages",
    });
  }
};

export const getSkillUserCounts = async (req, res) => {
  const { deptId } = req.params;

  try {
    // Group users by skill and count the number of users for each skill, only for users in the specific department
    const skillUserCounts = await prisma.skillUsers.groupBy({
      by: ['skill_id'],
      _count: {
        user_id: true, // Count the number of users for each skill
      },
      where: {
        user: {
          dept_id: parseInt(deptId), // Filter by the department ID
        },
      },
    });

    // Extract skill IDs from the results to fetch skill names
    const skillIds = skillUserCounts.map(item => item.skill_id);

    // Fetch the skill names for the skill IDs we found
    const skills = await prisma.skill.findMany({
      where: {
        skill_id: {
          in: skillIds,
        },
      },
      select: {
        skill_id: true,
        skill_name: true,
      },
    });

    // Create a map of skill_id to skill_name for easy lookup
    const skillMap = skills.reduce((map, skill) => {
      map[skill.skill_id] = skill.skill_name;
      return map;
    }, {});

    // Format the result to be more readable
    const formattedCounts = skillUserCounts.map((item) => ({
      skill_name: skillMap[item.skill_id] || 'Unknown Skill',
      user_count: item._count.user_id,
    }));

    return res.status(200).json(formattedCounts);
  } catch (error) {
    console.error("Error fetching skill user counts for department:", error);
    return res.status(500).json({
      error: "An error occurred while fetching skill user counts for the department",
    });
  }
};