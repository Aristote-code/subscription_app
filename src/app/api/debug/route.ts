import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection with a simple query
    const userCount = await prisma.user.count();

    // Return success response with diagnostics
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      diagnostics: {
        databaseConnected: true,
        userCount,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasGoogleCredentials: !!(
          process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ),
        hasGithubCredentials: !!(
          process.env.GITHUB_ID && process.env.GITHUB_SECRET
        ),
      },
    });
  } catch (error: any) {
    console.error("Database connection error:", error);

    // Return error response with diagnostics
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
        diagnostics: {
          databaseConnected: false,
          errorCode: error.code || "UNKNOWN",
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
          dbConnectionString: process.env.DATABASE_URL
            ? `${process.env.DATABASE_URL.substring(0, 12)}...`
            : "Not set",
        },
      },
      { status: 500 }
    );
  }
}
