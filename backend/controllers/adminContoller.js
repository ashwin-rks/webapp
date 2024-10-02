import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addDepartment = async (req, res) => {
  const { dept_name } = req.body;
  
  try {
    if (dept_name.toLowerCase() === 'manager') {
      return res.status(403).json({ error: 'Unauthorized to create or modify the "Manager" department' });
    }

    const existingDepartment = await prisma.department.findFirst({
      where: {
        dept_name: {
          equals: dept_name,
          mode: 'insensitive' 
        }
      }
    });

    if (existingDepartment) {
      return res.status(400).json({ error: 'Department name already exists' });
    }

    // Create a new department if it doesn't exist
    const newDepartment = await prisma.department.create({
      data: {
        dept_name
      }
    });

    return res.status(201).json({ message: 'Department added successfully', department: newDepartment });
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({ error: 'An error occurred while adding the department' });
  }
};

export const updateDepartment = async (req, res) => {
  const { dept_id, dept_name } = req.body;

  try {
    if (!dept_name.trim()) {
      return res.status(403).json({error: 'department name is found empty'})
    }

    const existingDepartment = await prisma.department.findUnique({
      where: {
        dept_id: dept_id,
      },
    });

    if (!existingDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }

    if (existingDepartment.dept_name.toLowerCase() === 'manager') {
      return res.status(403).json({ error: 'Unauthorized to modify the "Manager" department' });
    }

    const duplicateDepartment = await prisma.department.findFirst({
      where: {
        dept_name: {
          equals: dept_name,
          mode: 'insensitive', 
        },
      },
    });

    if (duplicateDepartment) {
      return res.status(400).json({ error: 'Department name already exists' });
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
      message: 'Department updated successfully',
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({ error: 'An error occurred while updating the department' });
  }
};

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

    const result = departments.map(department => ({
      id: department.dept_id,
      name: department.dept_name,
      totalPeople: department.users.length, 
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving departments' });
  }
};


// skill stuff

export const addSkill = async (req, res) => {
  const { skillName, departmentNames } = req.body;

  // Ensure both skillName and departmentNames are provided
  if (!skillName || !departmentNames || !Array.isArray(departmentNames)) {
    return res.status(400).json({ error: 'Skill name and department names are required and must be an array' });
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
      return res.status(400).json({ error: 'Some department names are invalid' });
    }

    // 3. Check if the skill already exists using findFirst
    let skill = await prisma.skill.findFirst({
      where: { skill_name: skillName },
    });

    if (skill) {
      return res.status(400).json({error: "Skill already exists"})
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
    const skillDepartments = departments.map(department => ({
      skill_id: skill.skill_id,
      dept_id: department.dept_id,
    }));

    await prisma.skillDepartment.createMany({
      data: skillDepartments,
      skipDuplicates: true, // Avoid creating duplicates if the relation already exists
    });

    res.status(201).json({ message: 'Skill successfully added to departments' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding skill to departments' });
  }
};

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

    const result = skills.map(skill => ({
      id: skill.skill_id,
      name: skill.skill_name,
      totalPeople: skill.skillUsers.length, 
      totalDepartments: skill.skillDepartments.length,
      departmentNames: skill.skillDepartments.map(department => department.department.dept_name)
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving skills information' });
  }
};

export const editSkill = async (req, res) => {
  const { id, name, departments } = req.body;

  // Ensure the skill id is provided
  if (!id) {
    return res.status(400).json({ error: 'Skill ID is required' });
  }

  try {
    // 1. Fetch the current skill by ID
    let skill = await prisma.skill.findUnique({
      where: { skill_id: id },
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // 2. If the name is different, check if the new name already exists
    if (name && name !== skill.skill_name) {
      const existingSkill = await prisma.skill.findFirst({
        where: { skill_name: name },
      });

      if (existingSkill) {
        return res.status(400).json({ error: 'Skill name already exists' });
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
            in: departments.filter((deptName) => deptName !== 'Manager'), // Skip "Manager"
          },
        },
      });

      if (validDepartments.length === 0) {
        return res.status(400).json({ error: 'No valid departments provided' });
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

    res.status(200).json({ message: 'Skill successfully updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating skill' });
  }
};
