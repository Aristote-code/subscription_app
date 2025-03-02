import { NextResponse } from "next/server";
import { runManualReminderCheck } from "@/utils/scheduler";

/**
 * POST handler to manually trigger reminder checks
 * This is useful for testing or admin operations
 * @returns Success message or error
 */
export async function POST() {
  try {
    // TODO: Add authentication to ensure only admins can trigger this

    await runManualReminderCheck();

    return NextResponse.json({
      success: true,
      message: "Reminder check triggered successfully",
    });
  } catch (error) {
    console.error("Error triggering reminder check:", error);
    return NextResponse.json(
      { success: false, error: "Failed to trigger reminder check" },
      { status: 500 }
    );
  }
}
