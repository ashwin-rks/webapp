import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsersInfo = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        account_type: true,
        dept_id: true,
        department: {
          select: {
            dept_name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Map through users to format the result
    const result = users.map((user) => ({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      accountType: user.account_type,
      deptId: user.dept_id,
      deptName: user.department.dept_name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params; // Assuming the user ID is passed in the URL parameters

  try {
    // Check if the user is an admin
    const user = await prisma.user.findUnique({
      where: { user_id: Number(userId) },
    });

    if (!user) {
      return res.status(403).json({error: `No account found for user ID ${userId}`});
    }

    if (user.account_type === "admin") {
      return res
        .status(403)
        .json({ message: "Admin accounts cannot be deleted." });
    }

    // Delete related entries in SkillUsers and CourseUser
    await prisma.skillUsers.deleteMany({
      where: { user_id: Number(userId) },
    });

    await prisma.courseUser.deleteMany({
      where: { user_id: Number(userId) },
    });

    // Now delete the user
    const deletedUser = await prisma.user.delete({
      where: { user_id: Number(userId) },
    });

    // Optionally, return deleted user's info (excluding password)
    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        id: deletedUser.user_id,
        firstName: deletedUser.first_name,
        lastName: deletedUser.last_name,
        email: deletedUser.email,
        accountType: deletedUser.account_type,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
