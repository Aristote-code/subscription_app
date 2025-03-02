import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET handler for fetching subscriptions
 * @returns All subscriptions for the authenticated user
 */
export async function GET(request: Request) {
  try {
    // TODO: Get user ID from authentication session
    const userId = "mock-user-id"; // This will be replaced with actual auth

    // Fetch subscriptions from database
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
      },
      include: {
        reminders: true,
      },
      orderBy: {
        trialEndDate: "asc",
      },
    });

    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new subscription
 * @param request Request with subscription data
 * @returns The created subscription
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: Get user ID from authentication session
    const userId = "mock-user-id"; // This will be replaced with actual auth

    // Validate required fields
    const { name, trialStartDate, trialEndDate, cost, billingCycle } = body;

    if (!name || !trialStartDate || !trialEndDate || !cost || !billingCycle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        ...body,
        userId,
        status: "active",
      },
    });

    // Create default reminder (5 days before trial ends)
    const reminderDate = new Date(trialEndDate);
    reminderDate.setDate(reminderDate.getDate() - 5);

    await prisma.reminder.create({
      data: {
        date: reminderDate,
        subscriptionId: subscription.id,
      },
    });

    return NextResponse.json(
      { success: true, data: subscription },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
