import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { USER_ROLES, isAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// Registration schema for validation
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z
    .string()
    .refine(
      (role) =>
        role === USER_ROLES.USER ||
        role === USER_ROLES.MANAGER ||
        role === USER_ROLES.ADMIN,
      { message: "Invalid role" }
    )
    .optional(),
  adminCreated: z.boolean().optional(),
});

/**
 * POST handler for user registration
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);

    // Return validation errors if any
    if (!validationResult.success) {
      const { errors } = validationResult.error;
      return NextResponse.json(
        {
          error: errors[0].message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      role = USER_ROLES.USER,
      adminCreated = false,
    } = validationResult.data;

    // If trying to create a non-USER role, check if requester is admin
    if (role !== USER_ROLES.USER) {
      const isUserAdmin = await isAdmin();

      if (!isUserAdmin && !adminCreated) {
        return NextResponse.json(
          {
            error: "Only admins can create users with elevated roles",
          },
          { status: 403 }
        );
      }
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
