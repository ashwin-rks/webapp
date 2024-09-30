import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // If user not found
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // assign jwt
    const token = jwt.sign(
      { userId: user.id, account_type: user.account_type },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      token,
      user: {
        account_type: user.account_type,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { first_name, last_name, account_type, email, password } = req.body;

    // Check for required fields
    if (!email || !password || !first_name || !last_name || !account_type) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).send({ error: "User already exists" });
    }
    
    if (account_type != 'user' && account_type != 'admin') {
      return res.status(400).send({error: 'Invalid account type'});
    }

    // hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        account_type: account_type,
        email: email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ error: error.message });
  }
};

export const validate = async (req, res) => {
  return res.status(200).json({ message: "Token is valid", user: req.user });
};
