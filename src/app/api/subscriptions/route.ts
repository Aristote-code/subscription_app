import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

/**
 * GET handler for fetching subscriptions
 * @returns All subscriptions for the authenticated user
 */
export async function GET(request: Request) {
  try {
    // Get user ID from JWT token
    const cookieStore = cookies();
    const token = await getToken({
      req: { cookies: cookieStore } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;

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
    // Get user ID from JWT token
    const cookieStore = cookies();
    const token = await getToken({
      req: { cookies: cookieStore } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;

    const body = await request.json();

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
        name: body.name,
        description: body.description,
        trialStartDate: body.trialStartDate,
        trialEndDate: body.trialEndDate,
        price: body.cost,
        billingCycle: body.billingCycle,
        cancellationUrl: body.cancellationUrl,
        userId,
        isActive: true,
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
