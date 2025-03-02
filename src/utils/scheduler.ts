import cron from "node-cron";
import { checkAndSendReminders } from "./reminder";

/**
 * Initialize scheduled jobs
 * This should be called when the server starts
 */
export const initScheduledJobs = (): void => {
  // Schedule reminder check to run daily at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("Running scheduled job: Check and send reminders");
    try {
      await checkAndSendReminders();
      console.log("Reminder check completed successfully");
    } catch (error) {
      console.error("Error in reminder check job:", error);
    }
  });

  console.log("Scheduled jobs initialized");
};

/**
 * Run a manual check for reminders
 * This can be called from an API endpoint for testing
 */
export const runManualReminderCheck = async (): Promise<void> => {
  console.log("Running manual reminder check");
  try {
    await checkAndSendReminders();
    console.log("Manual reminder check completed successfully");
  } catch (error) {
    console.error("Error in manual reminder check:", error);
    throw error;
  }
};
