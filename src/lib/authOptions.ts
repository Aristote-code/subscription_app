import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ExtendedSession } from "@/types";

const prisma = new PrismaClient();

// Define the authOptions config
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Only add Google provider if credentials are valid
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== "placeholder"
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
          }),
        ]
      : []),
    // Always include credentials provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordMatch) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
    newUser: "/signup", // New users will be directed here on first sign in
  },
  callbacks: {
    async session({ session, token, user }) {
      const extendedSession = session as ExtendedSession;

      // For JWT strategy (used by credentials provider)
      if (token) {
        if (token.sub) {
          extendedSession.user.id = token.sub;
        } else {
          extendedSession.user.id = (token.id as string) || "unknown";
        }
        // Set a default role if none exists
        extendedSession.user.role = (token.role as string) || "USER";
      }
      // For database strategy (used by OAuth providers with adapter)
      else if (user) {
        extendedSession.user.id = user.id;
        // If using an adapter, get the role from the user
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        extendedSession.user.role = userWithRole?.role || "USER";
      } else {
        // Fallback for any other unexpected case
        extendedSession.user.id = "unknown";
        extendedSession.user.role = "USER";
      }

      return extendedSession;
    },

    async jwt({ token, user, account }) {
      // When signIn completes, this callback adds the user info to the token
      if (user) {
        token.id = user.id;
        // Save role to token if available
        if ("role" in user && user.role) {
          token.role = user.role as string;
        } else {
          token.role = "USER"; // Default role
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Handle specific redirect after login
      if (
        url.includes("/api/auth/signin") ||
        url === "/api/auth/callback/credentials"
      ) {
        return `${baseUrl}/dashboard`;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
