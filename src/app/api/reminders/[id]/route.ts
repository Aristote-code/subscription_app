import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

/**
 * GET handler for fetching a single reminder
 * @returns The reminder with the given ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from JWT token
    const token = await getToken({ req: request });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;
    const reminderId = params.id;

    // Fetch reminder from database
    const reminder = await prisma.reminder.findUnique({
      where: {
        id: reminderId,
        subscription: {
          userId,
        },
      },
      include: {
        subscription: {
          select: {
            id: true,
            name: true,
            trialEndDate: true,
          },
        },
      },
    });

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: "Reminder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: reminder });
  } catch (error) {
    console.error("Error fetching reminder:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reminder" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a reminder
 * @param request Request with reminder data
 * @returns The updated reminder
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from JWT token
    const token = await getToken({ req: request });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;
    const reminderId = params.id;
    const body = await request.json();

    // Validate the reminder belongs to the user
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        subscription: {
          userId,
        },
      },
    });

    if (!existingReminder) {
      return NextResponse.json(
        { success: false, error: "Reminder not found or not authorized" },
        { status: 404 }
      );
    }

    // Update reminder data
    const { date, sent } = body;
    const updateData: any = {};

    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    if (sent !== undefined) {
      updateData.sent = sent;
    }

    // Update reminder in database
    const updatedReminder = await prisma.reminder.update({
      where: {
        id: reminderId,
      },
      data: updateData,
      include: {
        subscription: {
          select: {
            id: true,
            name: true,
            trialEndDate: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedReminder });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update reminder" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a reminder
 * @returns Success message or error
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from JWT token
    const token = await getToken({ req: request });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;
    const reminderId = params.id;

    // Validate the reminder belongs to the user
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        subscription: {
          userId,
        },
      },
    });

    if (!existingReminder) {
      return NextResponse.json(
        { success: false, error: "Reminder not found or not authorized" },
        { status: 404 }
      );
    }

    // Delete reminder from database
    await prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Reminder deleted successfully" },
    });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete reminder" },
      { status: 500 }
    );
  }
}
