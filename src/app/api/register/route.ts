import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create a new PrismaClient instance for this request
    const prismaClient = new PrismaClient();

    try {
      // Check if user already exists
      const existingUser = await prismaClient.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          plan: "free",
        },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(userWithoutPassword);
    } finally {
      // Always disconnect the client
      await prismaClient.$disconnect();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
