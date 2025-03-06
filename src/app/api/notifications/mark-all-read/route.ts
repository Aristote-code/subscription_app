import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/utils/auth";

/**
 * PUT handler for marking all notifications as read
 * @returns Success message
 */
export async function PUT(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update all unread notifications for the user
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        count: result.count,
        message: "All notifications marked as read",
      },
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
