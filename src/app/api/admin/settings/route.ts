import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

// Default settings
const DEFAULT_SETTINGS = {
  enableEmailNotifications: true,
  enableTrialEndReminders: true,
  defaultReminderDays: 3,
  maxSubscriptionsPerUser: 50,
  maintenanceMode: false,
};

/**
 * GET /api/admin/settings
 * Get system settings (admin only)
 */
export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId = token?.sub;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    // Get settings from database
    const settings = await prisma.systemSettings.findFirst();

    // Return settings or defaults if none exist
    return NextResponse.json({
      success: true,
      data: settings || DEFAULT_SETTINGS,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Update system settings (admin only)
 */
export async function PUT(request: Request) {
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

    // Check if user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate settings
    const settings = {
      enableEmailNotifications: body.enableEmailNotifications === true,
      enableTrialEndReminders: body.enableTrialEndReminders === true,
      defaultReminderDays: Math.max(
        1,
        Math.min(30, parseInt(body.defaultReminderDays) || 3)
      ),
      maxSubscriptionsPerUser: Math.max(
        1,
        Math.min(100, parseInt(body.maxSubscriptionsPerUser) || 50)
      ),
      maintenanceMode: body.maintenanceMode === true,
    };

    // Update settings in database
    const existingSettings = await prisma.systemSettings.findFirst();

    let updatedSettings;

    if (existingSettings) {
      // Update existing settings
      updatedSettings = await prisma.systemSettings.update({
        where: { id: existingSettings.id },
        data: settings,
      });
    } else {
      // Create new settings
      updatedSettings = await prisma.systemSettings.create({
        data: settings,
      });
    }

    // Return updated settings
    return NextResponse.json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
