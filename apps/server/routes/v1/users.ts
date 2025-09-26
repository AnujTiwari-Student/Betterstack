import type { Router, Request, Response } from "express";
import express from "express";
import prisma from "database/client";
import bcrypt from "bcryptjs";
import { CreateUserSchema, LoginUserSchema } from "../../types";
import jwt from "jsonwebtoken";

const router = express.Router();

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const isPrismaError = (error: unknown): error is { code: string; message: string } => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const validatedFields = CreateUserSchema.safeParse(req.body);
    if (!validatedFields.success) {
      return res.status(400).json({ 
        error: "Invalid input data",
        details: validatedFields.error.issues 
      });
    }

    const { username, password } = validatedFields.data;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({ 
      id: newUser.id, 
      username: newUser.username,
      message: "User created successfully"
    });

  } catch (error: unknown) {
    console.error("Signup error:", error);
    
    if (isPrismaError(error) && error.code === 'P2002') {
      return res.status(409).json({ error: "Username already exists" });
    }
    
    if (isError(error)) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: "Invalid user data" });
      }
      
      if (error.message.includes('bcrypt')) {
        return res.status(500).json({ error: "Password hashing failed" });
      }
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const validatedFields = LoginUserSchema.safeParse(req.body);
    if (!validatedFields.success) {
      return res.status(400).json({ 
        error: "Invalid input data",
        details: validatedFields.error.issues 
      });
    }

    const { username, password } = validatedFields.data;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!existingUser.password) {
      return res.status(500).json({ error: "User account error" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ sub: existingUser.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    res.status(200).json({ 
      token,
      message: "Login successful"
    });

  } catch (error: unknown) {
    console.error("Login error:", error);
    
    if (isError(error)) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: "Invalid login data" });
      }

      if (error.message.includes('bcrypt')) {
        return res.status(500).json({ error: "Authentication system error" });
      }
    }

    if (isPrismaError(error)) {
      return res.status(500).json({ error: "Database connection error" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
