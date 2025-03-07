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
  console.log("[REGISTER] Registration request received");
  try {
    // Parse and validate request body
    const body = await request.json().catch((error) => {
      console.error("[REGISTER] Failed to parse request body:", error);
      return null;
    });

    if (!body) {
      console.error(
        "[REGISTER] Invalid request body: body is null or undefined"
      );
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    console.log("[REGISTER] Validating request data", { email: body.email });
    const validationResult = registerSchema.safeParse(body);

    // Return validation errors if any
    if (!validationResult.success) {
      const { errors } = validationResult.error;
      const errorMessage = errors[0].message || "Invalid input";
      console.error("[REGISTER] Validation error:", errorMessage);
      return NextResponse.json(
        { success: false, error: errorMessage },
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
      console.log("[REGISTER] Checking admin permissions for elevated role");
      const isUserAdmin = await isAdmin();

      if (!isUserAdmin && !adminCreated) {
        console.error("[REGISTER] Non-admin tried to create elevated role");
        return NextResponse.json(
          {
            success: false,
            error: "Only admins can create users with elevated roles",
          },
          { status: 403 }
        );
      }
    }

    // Check if user with email already exists
    console.log("[REGISTER] Checking if email already exists:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      console.error("[REGISTER] User with email already exists:", email);
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    console.log("[REGISTER] Hashing password");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    console.log("[REGISTER] Creating new user");
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

    console.log("[REGISTER] User created successfully:", {
      id: user.id,
      email: user.email,
    });
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("[REGISTER] Registration error:", error);

    // Handle Prisma-specific errors
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
