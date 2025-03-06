import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * GET /api/admin/users
 * Fetch all users with subscription counts
 * Admin-only endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Check if the user is an admin
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get all users with related counts
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            subscriptions: true,
            reminders: true,
            notifications: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new user (admin-only)
 * This calls the registration endpoint with the admin role
 */
export async function POST(request: NextRequest) {
  try {
    // Check if the user is an admin
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Call the registration endpoint
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          adminCreated: true, // Flag to indicate this was created by an admin
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || "Failed to create user" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users?id=123
 * Delete a user (admin-only)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check if the user is an admin
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get the user ID from the query params
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't allow deleting other admins
    if (userExists.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 403 }
      );
    }

    // Delete the user and all related data
    await prisma.$transaction([
      // Delete user's notifications
      prisma.notification.deleteMany({
        where: { userId },
      }),
      // Delete user's reminders
      prisma.reminder.deleteMany({
        where: { subscription: { userId } },
      }),
      // Delete user's subscriptions
      prisma.subscription.deleteMany({
        where: { userId },
      }),
      // Delete user's sessions
      prisma.session.deleteMany({
        where: { userId },
      }),
      // Delete user's accounts (oauth connections)
      prisma.account.deleteMany({
        where: { userId },
      }),
      // Finally delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
