import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/utils/auth";

/**
 * GET handler for fetching all notifications for a user
 * @returns All notifications for the authenticated user
 */
export async function GET(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch notifications from database
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new notification
 * @param request Request with notification data
 * @returns The created notification
 */
export async function POST(request: Request) {
  try {
    // For admin or system-generated notifications
    // This endpoint would typically be called by internal services

    const body = await request.json();
    const { userId, type, title, message } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        read: false,
      },
    });

    return NextResponse.json(
      { success: true, data: notification },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
