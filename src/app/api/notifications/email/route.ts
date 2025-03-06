import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import {
  sendTrialEndingEmail,
  sendPaymentDueEmail,
  sendSubscriptionCancelledEmail,
} from "@/utils/email";

/**
 * POST /api/notifications/email
 * Send an email notification
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { type, subscriptionId } = body;

    if (!type || !subscriptionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get subscription and user details
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!subscription || !subscription.user) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Calculate days remaining for trial or payment
    const now = new Date();
    const daysRemaining = subscription.trialEndDate
      ? Math.ceil(
          (subscription.trialEndDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    // Construct dashboard URL
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

    // Send appropriate email based on notification type
    let emailSent = false;

    switch (type) {
      case "trialEnding":
        if (subscription.trialEndDate && daysRemaining > 0) {
          emailSent = await sendTrialEndingEmail({
            to: subscription.user.email,
            serviceName: subscription.name,
            daysRemaining,
            dashboardUrl,
          });
        }
        break;

      case "paymentDue":
        if (!subscription.trialEndDate || daysRemaining <= 0) {
          emailSent = await sendPaymentDueEmail({
            to: subscription.user.email,
            serviceName: subscription.name,
            daysRemaining: 5, // Default to 5 days before payment
            amount: subscription.price,
            dashboardUrl,
          });
        }
        break;

      case "subscriptionCancelled":
        emailSent = await sendSubscriptionCancelledEmail({
          to: subscription.user.email,
          serviceName: subscription.name,
          dashboardUrl,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid notification type" },
          { status: 400 }
        );
    }

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Create notification record in database
    await prisma.notification.create({
      data: {
        userId: subscription.userId,
        type,
        title: `Email notification sent for ${subscription.name}`,
        message: `Email notification of type "${type}" was sent successfully`,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending email notification:", error);
    return NextResponse.json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
}
