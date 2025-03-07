import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

/**
 * GET handler for fetching a specific subscription
 * @param request Request object
 * @param params Route parameters containing subscription ID
 * @returns The requested subscription
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // Fetch subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: {
        id,
      },
      include: {
        reminders: true,
      },
    });

    // Check if subscription exists
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check if subscription belongs to user
    if (subscription.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Map the subscription to include cost field for frontend consistency
    const mappedSubscription = {
      ...subscription,
      cost: subscription.price,
    };

    return NextResponse.json({ success: true, data: mappedSubscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a subscription
 * @param request Request with updated subscription data
 * @param params Route parameters containing subscription ID
 * @returns The updated subscription
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
    console.log("Update subscription data:", body);

    // Check if subscription exists and belongs to user
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (existingSubscription.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Prepare data for update - handle cost to price mapping
    const updateData = { ...body };

    // If cost is provided, use it to update price
    if (typeof updateData.cost !== "undefined") {
      updateData.price = parseFloat(updateData.cost.toString());
      delete updateData.cost; // Remove cost as it's not in the schema
    }

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id,
      },
      data: updateData,
    });

    // Map the subscription to include cost field for frontend consistency
    const mappedSubscription = {
      ...updatedSubscription,
      cost: updatedSubscription.price,
    };

    return NextResponse.json({ success: true, data: mappedSubscription });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a subscription
 * @param request Request object
 * @param params Route parameters containing subscription ID
 * @returns Success message
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // Check if subscription exists and belongs to user
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (existingSubscription.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete subscription from database
    await prisma.subscription.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
