import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// for admin
export const getAllCoursesInfo = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        courseDepartments: {
          select: {
            department: {
              select: {
                dept_id: true,
                dept_name: true,
              },
            },
          },
        },
        courseUsers: {
          select: {
            user_id: true,
          },
        },
      },
    });

    const result = courses.map((course) => ({
      id: course.course_id,
      name: course.course_name,
      description: course.course_desc,
      creator: `${course.creator.first_name} ${course.creator.last_name}`,
      course_img: course.course_img,
      totalDepartments: course.courseDepartments.length,
      totalPeople: course.courseUsers.length,
      departmentNames: course.courseDepartments.map(
        (department) => department.department.dept_name
      ),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving courses information" });
  }
};

export const addCourse = async (req, res) => {
  const { course_name, course_desc, course_img, departments } = req.body;

  if (
    !course_name ||
    course_name.length > 50 ||
    !course_desc ||
    course_desc.length > 100 ||
    !course_img ||
    !departments ||
    !Array.isArray(departments)
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid input: ensure all fields are provided and meet the character limits",
      });
  }

  try {
    // 1. Check if the creator exists and is a manager
    const creator = await prisma.user.findFirst({
      where: {
        user_id: req.user.user_id,
        account_type: { equals: "admin", mode: "insensitive" }, // Case-insensitive check for account type
      },
    });

    if (!creator) {
      return res
        .status(400)
        .json({ error: "Course creator not found or is not a manager" });
    }

    // 2. Check if the course name already exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        course_name: { equals: course_name, mode: "insensitive" }, // Case-insensitive check for course name
      },
    });

    if (existingCourse) {
      return res
        .status(400)
        .json({ error: "Course with this name already exists" });
    }

    // 3. Check if all department names are valid and that they don't contain a "manager" department
    const departmentsData = await prisma.department.findMany({
      where: {
        dept_name: {
          in: departments.map((dept) => dept.toLowerCase()), // Case-insensitive department search
          mode: "insensitive",
        },
      },
    });

    if (departmentsData.length !== departments.length) {
      return res
        .status(400)
        .json({ error: "Some department names are invalid" });
    }

    const managerDept = departmentsData.find((dept) =>
      dept.dept_name.toLowerCase().includes("manager")
    );
    if (managerDept) {
      return res
        .status(400)
        .json({ error: "Cannot assign courses to manager departments" });
    }

    // 4. Create the new course
    const newCourse = await prisma.course.create({
      data: {
        course_name: course_name,
        course_desc: course_desc,
        course_img: course_img,
        course_creator: creator.user_id,
      },
    });

    // 5. Create entries in the CourseDepartment table for each department
    const courseDepartments = departmentsData.map((department) => ({
      course_id: newCourse.course_id,
      dept_id: department.dept_id,
    }));

    await prisma.courseDepartment.createMany({
      data: courseDepartments,
      skipDuplicates: true,
    });

    res
      .status(201)
      .json({
        message: "Course successfully created and assigned to departments",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const editCourse = async (req, res) => {
  const { course_id, course_name, course_desc, course_img, departments } =
    req.body;

  // Ensure the course ID is provided
  if (!course_id) {
    return res.status(400).json({ error: "Course ID is required" });
  }

  try {
    // 1. Fetch the current course by ID
    let course = await prisma.course.findUnique({
      where: { course_id: course_id },
      include: {
        creator: {
          select: { account_type: true }, // Ensure the creator is a manager
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // 2. Edit the course name (only if it's different, not already taken, and less than 50 characters)
    if (course_name && course_name !== course.course_name) {
      if (course_name.length > 50) {
        return res
          .status(400)
          .json({ error: "Course name must be less than 50 characters" });
      }

      const existingCourse = await prisma.course.findFirst({
        where: { course_name: course_name },
      });

      if (existingCourse) {
        return res.status(400).json({ error: "Course name already exists" });
      }

      // Update the course's name
      course = await prisma.course.update({
        where: { course_id: course_id },
        data: { course_name: course_name },
      });
    }

    // 3. Edit the course description (if less than 100 characters)
    if (course_desc) {
      if (course_desc.length > 100) {
        return res
          .status(400)
          .json({
            error: "Course description must be less than 100 characters",
          });
      }

      await prisma.course.update({
        where: { course_id: course_id },
        data: { course_desc },
      });
    }

    // 4. Edit the course image link
    if (course_img) {
      await prisma.course.update({
        where: { course_id: course_id },
        data: { course_img },
      });
    }

    // 5. Add new departments to the course
    if (departments && departments.length > 0) {
      // Fetch valid departments excluding "Manager" department
      const validDepartments = await prisma.department.findMany({
        where: {
          dept_name: {
            in: departments.filter(
              (deptName) => deptName.toLowerCase() !== "manager"
            ),
          },
        },
      });

      if (validDepartments.length > 0) {
        // Get existing course-department relations
        const existingRelations = await prisma.courseDepartment.findMany({
          where: { course_id: course_id },
        });

        const existingDeptIds = existingRelations.map((rel) => rel.dept_id);

        // Filter out departments that already exist in courseDepartment table for this course
        const newRelations = validDepartments
          .filter((dept) => !existingDeptIds.includes(dept.dept_id))
          .map((dept) => ({
            course_id: course_id,
            dept_id: dept.dept_id,
          }));

        // Add new course-department relations, if any
        if (newRelations.length > 0) {
          await prisma.courseDepartment.createMany({
            data: newRelations,
            skipDuplicates: true, // Ensure no duplicates are created
          });
        }
      }
    }

    res.status(200).json({ message: "Course successfully updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating course" });
  }
};


// user courses
export const enrollInCourse = async (req, res) => {
  try {
    const user_id = req.user.userId; 
    const { course_id, user_score } = req.body; 

    const user = await prisma.user.findUnique({
      where: { user_id: user_id },
    });

    if (!user || user.account_type !== 'user') {
      return res.status(404).json({ message: "User not found or not authorized" });
    }

    const course = await prisma.course.findUnique({
      where: { course_id: course_id },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingEnrollment = await prisma.courseUser.findUnique({
      where: {
        course_id_user_id: {
          course_id: course_id,
          user_id: user_id,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "User is already enrolled in this course" });
    }

    const parsedScore = parseInt(user_score, 10);
    if (parsedScore < 0 || parsedScore > 100) {
      return res.status(400).json({ message: "User score must be between 0 and 100" });
    }

    // Enroll the user in the course
    const enrollment = await prisma.courseUser.create({
      data: {
        course_id: course_id,
        user_id: user_id,
        user_score: parsedScore,
      },
    });

    res.status(200).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enrolling in course" });
  }
};


export const getUserCoursesInfo = async (req, res) => {
  try {
    const user_id = req.user.userId; 

    const user = await prisma.user.findUnique({
      where: { user_id: user_id },
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
                user_id: user_id,
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
                user_id: user_id, 
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
            user_id: user_id,
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