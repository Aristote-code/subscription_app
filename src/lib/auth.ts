import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// Get the current session on the server
export async function getSession() {
  return await getServerSession(authOptions);
}

// Get the current user on the server
export async function getCurrentUser() {
  try {
    const session = await getSession();

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
        createdAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if the user is authenticated on the server
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

// Get the current token on the server
export async function getToken(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

// Verify a JWT token string and return the payload
export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
