import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // TODO: Get user ID from authentication session
    const userId = "mock-user-id"; // This will be replaced with actual auth

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

    return NextResponse.json({ success: true, data: subscription });
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
    const body = await request.json();

    // TODO: Get user ID from authentication session
    const userId = "mock-user-id"; // This will be replaced with actual auth

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

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id,
      },
      data: body,
    });

    return NextResponse.json({ success: true, data: updatedSubscription });
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

    // TODO: Get user ID from authentication session
    const userId = "mock-user-id"; // This will be replaced with actual auth

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
