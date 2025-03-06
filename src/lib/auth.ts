import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// Define user roles and their hierarchy
export const USER_ROLES = {
  USER: "USER",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Role hierarchy - higher roles have access to lower role permissions
const ROLE_HIERARCHY: Record<string, string[]> = {
  [USER_ROLES.ADMIN]: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER],
  [USER_ROLES.MANAGER]: [USER_ROLES.MANAGER, USER_ROLES.USER],
  [USER_ROLES.USER]: [USER_ROLES.USER],
};

const prisma = new PrismaClient();

// Define auth options
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/dashboard",
  },
  providers: [
    // Only add Google provider if credentials are valid
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== "placeholder"
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                role: USER_ROLES.USER, // Default role for Google sign-ins
              };
            },
          }),
        ]
      : []),
    // Only add GitHub provider if credentials are valid
    ...(process.env.GITHUB_ID &&
    process.env.GITHUB_SECRET &&
    process.env.GITHUB_ID !== "placeholder"
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            profile(profile) {
              return {
                id: profile.id.toString(),
                name: profile.name || profile.login,
                email: profile.email,
                image: profile.avatar_url,
                role: USER_ROLES.USER, // Default role for GitHub sign-ins
              };
            },
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            throw new Error("No user found with this email");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For social logins, make sure the user has a record in the database
        if (account.provider === "google" || account.provider === "github") {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, role: true },
          });

          if (dbUser) {
            // Use the role from the database if it exists
            return {
              ...token,
              id: dbUser.id,
              role: dbUser.role,
            };
          }
        }

        return {
          ...token,
          id: user.id,
          role: user.role || USER_ROLES.USER,
        };
      }

      // For subsequent calls, return the existing token
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  events: {
    // Add event handlers for important auth events
    createUser: async ({ user }) => {
      console.log(`New user created: ${user.email}`);
    },
    signIn: async ({ user, account, isNewUser }) => {
      console.log(
        `User signed in: ${user.email} via ${
          account?.provider || "credentials"
        }`
      );
      if (isNewUser) {
        // Any first-time login processing goes here
      }
    },
    signOut: async ({ token }) => {
      console.log(`User signed out: ${token.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// Get the current session on the server
export async function getSession() {
  return await getServerSession(authOptions);
}

// Get the current user on the server with full details
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

// Get the user ID for the current request
export async function getUserId() {
  try {
    // For development convenience
    if (
      process.env.NODE_ENV === "development" &&
      process.env.SKIP_AUTH === "true"
    ) {
      // Get a test user ID from the database when in dev mode
      const testUser = await prisma.user.findFirst({
        where: { role: USER_ROLES.USER },
        select: { id: true },
      });
      if (testUser) return testUser.id;
    }

    const session = await getSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

// Check if the user is authenticated
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

// Check if the user has admin role
export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === USER_ROLES.ADMIN;
}

// Check if the user has a specific role (or higher in the hierarchy)
export async function hasRole(requiredRole: string) {
  const session = await getSession();

  if (!session?.user?.role) {
    return false;
  }

  const userRole = session.user.role;
  const allowedRoles = ROLE_HIERARCHY[userRole] || [];

  return allowedRoles.includes(requiredRole);
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
