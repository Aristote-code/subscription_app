import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Gets the user ID from the JWT token or from the test user in development mode
 * @returns User ID or null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  try {
    // Get user ID from JWT token
    const cookieStore = cookies();
    const token = await getToken({
      req: { cookies: cookieStore } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token && token.sub) {
      return token.sub;
    }

    // For development mode, use the test user from seed data
    if (process.env.NODE_ENV === "development") {
      const testUser = await prisma.user.findFirst({
        where: { email: "user@example.com" },
      });

      if (testUser) {
        return testUser.id;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

/**
 * Checks if the user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getUserId();
  return !!userId;
}

/**
 * Checks if the user has admin role
 * @returns Boolean indicating if the user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Checks if the user has the required role
 * @param requiredRole The role required for access
 * @returns Boolean indicating if the user has the required role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return false;
    }

    // If admin role is required, check for exact match
    if (requiredRole === "ADMIN") {
      return user.role === "ADMIN";
    }

    // Admin role has access to all other roles
    if (user.role === "ADMIN") {
      return true;
    }

    // Otherwise check if the user's role matches the required role
    return user.role === requiredRole;
  } catch (error) {
    console.error(`Error checking ${requiredRole} role:`, error);
    return false;
  }
}

/**
 * Get the current user's full information
 * @returns Full user object or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
