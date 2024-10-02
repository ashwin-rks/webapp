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
