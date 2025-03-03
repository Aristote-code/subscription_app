import { NextResponse } from "next/server";
import { runManualReminderCheck } from "@/utils/scheduler";
import { getToken } from "next-auth/jwt";

/**
 * POST handler for manually triggering reminder checks
 * Only accessible to admin users
 * @returns Success message or error
 */
export async function POST(request: Request) {
  try {
    // Get user from JWT token
    const token = await getToken({ req: request });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is an admin
    // This assumes your user model has an isAdmin field
    // You may need to adjust this based on your auth implementation
    const isAdmin = token.isAdmin === true;

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Run manual reminder check
    await runManualReminderCheck();

    return NextResponse.json({
      success: true,
      data: { message: "Reminder check triggered successfully" },
    });
  } catch (error) {
    console.error("Error triggering reminder check:", error);
    return NextResponse.json(
      { success: false, error: "Failed to trigger reminder check" },
      { status: 500 }
    );
  }
}
