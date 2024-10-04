import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSkillsInfo = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        skillUsers: {
          select: {
            user_id: true,
          },
        },
        skillDepartments: {
          select: {
            department: {
              select: {
                dept_id: true,
                dept_name: true,
              },
            },
          },
        },
      },
    });

    const result = skills.map((skill) => ({
      id: skill.skill_id,
      name: skill.skill_name,
      totalPeople: skill.skillUsers.length,
      totalDepartments: skill.skillDepartments.length,
      departmentNames: skill.skillDepartments.map(
        (department) => department.department.dept_name
      ),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving skills information" });
  }
};

export const addSkill = async (req, res) => {
  const { skillName, departmentNames } = req.body;

  // Ensure both skillName and departmentNames are provided
  if (!skillName || !departmentNames || !Array.isArray(departmentNames)) {
    return res.status(400).json({
      error:
        "Skill name and department names are required and must be an array",
    });
  }

  try {
    // 1. Check if all department names exist
    const departments = await prisma.department.findMany({
      where: {
        dept_name: {
          in: departmentNames,
        },
      },
    });

    // 2. Verify if the number of departments found matches the number of department names provided
    if (departments.length !== departmentNames.length) {
      return res
        .status(400)
        .json({ error: "Some department names are invalid" });
    }

    // 3. Check if the skill already exists using findFirst
    let skill = await prisma.skill.findFirst({
      where: { skill_name: skillName },
    });

    if (skill) {
      return res.status(400).json({ error: "Skill already exists" });
    }

    // 4. If the skill does not exist, create it
    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          skill_name: skillName,
        },
      });
    }

    // 5. Create entries in the SkillDepartment table for each department
    const skillDepartments = departments.map((department) => ({
      skill_id: skill.skill_id,
      dept_id: department.dept_id,
    }));

    await prisma.skillDepartment.createMany({
      data: skillDepartments,
      skipDuplicates: true, // Avoid creating duplicates if the relation already exists
    });

    res
      .status(201)
      .json({ message: "Skill successfully added to departments" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding skill to departments" });
  }
};

export const editSkill = async (req, res) => {
  const { id, name, departments } = req.body;

  // Ensure the skill id is provided
  if (!id) {
    return res.status(400).json({ error: "Skill ID is required" });
  }

  try {
    // 1. Fetch the current skill by ID
    let skill = await prisma.skill.findUnique({
      where: { skill_id: id },
    });

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    // 2. If the name is different, check if the new name already exists
    if (name && name !== skill.skill_name) {
      const existingSkill = await prisma.skill.findFirst({
        where: { skill_name: name },
      });

      if (existingSkill) {
        return res.status(400).json({ error: "Skill name already exists" });
      }

      // Update the skill's name if it doesn't exist
      skill = await prisma.skill.update({
        where: { skill_id: id },
        data: { skill_name: name },
      });
    }

    // 3. If departments array is provided and not empty, process department associations
    if (departments && departments.length > 0) {
      // Fetch valid department entries excluding the "Manager" department
      const validDepartments = await prisma.department.findMany({
        where: {
          dept_name: {
            in: departments.filter((deptName) => deptName !== "Manager"), // Skip "Manager"
          },
        },
      });

      if (validDepartments.length === 0) {
        return res.status(400).json({ error: "No valid departments provided" });
      }

      // Get existing skill-department relations
      const existingRelations = await prisma.skillDepartment.findMany({
        where: { skill_id: id },
      });

      const existingDeptIds = existingRelations.map((rel) => rel.dept_id);

      // Filter out departments that already exist in skillDepartment table for this skill
      const newRelations = validDepartments
        .filter((dept) => !existingDeptIds.includes(dept.dept_id))
        .map((dept) => ({
          skill_id: id,
          dept_id: dept.dept_id,
        }));

      // Add new skill-department relations, if any
      if (newRelations.length > 0) {
        await prisma.skillDepartment.createMany({
          data: newRelations,
          skipDuplicates: true, // Ensure no duplicates are created
        });
      }
    }

    res.status(200).json({ message: "Skill successfully updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating skill" });
  }
};

// user skills

export const addSkillForUser = async (req, res) => {
  try {
    // 1. Check if the user exists and their account_type is 'user'
    const user = await prisma.user.findUnique({
      where: {
        user_id: req.user.userId,
      },
      select: {
        account_type: true,
        dept_id: true,
      },
    });

    if (!user || user.account_type !== "user") {
      return res
        .status(403)
        .json({ message: "Access denied or user not found" });
    }

    const { dept_id } = user;

    // 2. Extract skill_id and competency from the request body
    const { skill_id, competency } = req.body;

    if (!skill_id || !competency) {
      return res
        .status(400)
        .json({ message: "Skill ID and competency are required" });
    }

    // 3. Check if the skill exists
    const skill = await prisma.skill.findUnique({
      where: { skill_id },
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // 4. Check if the skill_id and dept_id combination exists in SkillDepartment table
    const skillDeptExists = await prisma.skillDepartment.findUnique({
      where: {
        skill_id_dept_id: { skill_id, dept_id }, // using the unique combination
      },
    });

    if (!skillDeptExists) {
      return res.status(400).json({
        message: "This skill is not associated with your department",
      });
    }

    // 5. Check if the user_id and skill_id combination already exists in SkillUsers
    const skillUserExists = await prisma.skillUsers.findUnique({
      where: {
        skill_id_user_id: { skill_id, user_id: req.user.userId }, // using the unique combination
      },
    });

    if (skillUserExists) {
      return res
        .status(400)
        .json({ message: "Skill already added for this user" });
    }

    // 6. Add the skill to the SkillUsers table
    const newSkillUser = await prisma.skillUsers.create({
      data: {
        skill_id,
        user_id: req.user.userId,
        competency,
      },
    });

    return res
      .status(201)
      .json({ message: "Skill added successfully", newSkillUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding skill for user" });
  }
};

export const getUserSkillsInfo = async (req, res) => {
  try {
    // 1. Check if the user exists and get their dept_id
    const user = await prisma.user.findUnique({
      where: {
        user_id: req.user.userId,
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
            skill_id_user_id: { skill_id, user_id: req.user.userId },
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

export const updateUserSkillCompetency = async (req, res) => {
  try {
    // 1. Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        user_id: req.user.userId,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // 2. Extract skill_id and new competency from request body
    const { skill_id, competency } = req.body;

    if (!skill_id || !competency) {
      return res
        .status(400)
        .json({ message: "Skill ID and competency are required" });
    }

    // 3. Check if the skill_id and user_id combination exists in SkillUsers
    const skillUser = await prisma.skillUsers.findUnique({
      where: {
        skill_id_user_id: { skill_id, user_id: req.user.userId },
      },
    });

    if (!skillUser) {
      return res
        .status(404)
        .json({ message: "Skill entry not found for this user" });
    }

    // 4. Update the competency in SkillUsers
    const updatedSkillUser = await prisma.skillUsers.update({
      where: {
        skill_id_user_id: { skill_id, user_id: req.user.userId },
      },
      data: {
        competency,
      },
    });

    return res
      .status(200)
      .json({ message: "Competency updated successfully", updatedSkillUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating competency" });
  }
};
