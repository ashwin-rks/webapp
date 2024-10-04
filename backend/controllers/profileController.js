import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getUserInfo = async (req, res) => {
  try {
    const user_id = req.user.userId;
    
    const user = await prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
      select: {
        user_id: true,
        first_name: true, 
        last_name: true,  
        email: true,
        createdAt: true,
        department: { 
          select: {
            dept_name: true, 
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.department) {
      return res.status(404).json({ message: "Invalid user" });
    }

    const result = {
      user_id: user.user_id,
      name: user.first_name, 
      last_name: user.last_name,
      email: user.email,
      createdAt: user.createdAt,
      dept_name: user.department.dept_name,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user information" });
  }
};

export const editUserInfo = async (req, res) => {
  try {
    const user_id = req.user.userId; 
    const { first_name, last_name } = req.body; 

    if (!first_name && !last_name) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update the user information
    const updatedUser = await prisma.user.update({
      where: {
        user_id: user_id,
      },
      data: {
        ...(first_name && { first_name }), 
        ...(last_name && { last_name }),   
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        createdAt: true,
        department: {
          select: {
            dept_name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "User information updated successfully",
      user: {
        user_id: updatedUser.user_id,
        name: `${updatedUser.first_name} ${updatedUser.last_name}`,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        dept_name: updatedUser.department.dept_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user information" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user_id = req.user.userId; 
    const { old_password, new_password } = req.body; 

    if (!old_password || !new_password) {
      return res.status(400).json({ message: "Old password and new password are required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10); 

    await prisma.user.update({
      where: {
        user_id: user_id,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
};
