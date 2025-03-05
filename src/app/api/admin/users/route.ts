import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET() {
  try {
    // Get user ID from session token
    const cookieStore = cookies();
    const token = await getToken({
      req: { cookies: cookieStore } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if user is authenticated and is an admin
    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get all users with subscription count
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format users for response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "Unnamed User",
      email: user.email,
      isAdmin: user.role === "ADMIN",
      createdAt: user.createdAt.toISOString(),
      subscriptionCount: user._count.subscriptions,
    }));

    // Return users
    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
