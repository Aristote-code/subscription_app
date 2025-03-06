import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/utils/auth";

/**
 * GET handler for fetching reminders
 * @returns All reminders for the authenticated user
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

    const url = new URL(request.url);
    const subscriptionId = url.searchParams.get("subscriptionId");

    // Base query to find reminders for the user's subscriptions
    const query: any = {
      where: {
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
      orderBy: {
        date: "asc",
      },
    };

    // If subscription ID is provided, filter by that subscription
    if (subscriptionId) {
      query.where.subscription.id = subscriptionId;
    }

    // Fetch reminders from database
    const reminders = await prisma.reminder.findMany(query);

    return NextResponse.json({ success: true, data: reminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new reminder
 * @param request Request with reminder data
 * @returns The created reminder
 */
export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { subscriptionId, date } = body;

    if (!subscriptionId || !date) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the subscription belongs to the user
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "Subscription not found or not authorized" },
        { status: 404 }
      );
    }

    // Create reminder in database
    const reminder = await prisma.reminder.create({
      data: {
        date: new Date(date),
        subscriptionId,
        userId,
        sent: false,
      },
      include: {
        subscription: {
          select: {
            name: true,
            trialEndDate: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: reminder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}
