import cron from "node-cron";
import { checkAndSendReminders } from "./reminder";
import { prisma } from "@/lib/prisma";

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
 * Runs a check for reminders that need to be sent today
 * Creates notifications for any due reminders
 */
export async function runManualReminderCheck() {
  console.log("Running manual reminder check...");

  try {
    // Get current date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all reminders due today that haven't been sent
    const dueReminders = await prisma.reminder.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        sent: false,
      },
      include: {
        subscription: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(`Found ${dueReminders.length} due reminders`);

    // Process each reminder
    for (const reminder of dueReminders) {
      // Create a notification for this reminder
      await prisma.notification.create({
        data: {
          type: "reminder",
          title: "Subscription Reminder",
          message: `Your ${reminder.subscription.name} trial is ending soon. Don't forget to cancel if you don't want to be charged.`,
          read: false,
          userId: reminder.userId,
        },
      });

      // Mark reminder as sent
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { sent: true },
      });

      // Here you would also send an email using your email service (SendGrid, etc.)
      // sendReminderEmail(reminder.user.email, reminder.subscription.name, reminder.subscription.trialEndDate);

      console.log(
        `Processed reminder for user ${reminder.userId} for subscription ${reminder.subscription.name}`
      );
    }

    return { success: true, count: dueReminders.length };
  } catch (error) {
    console.error("Error processing reminders:", error);
    throw error;
  }
}

/**
 * Placeholder for email sending function
 * In a real application, this would integrate with an email service
 */
function sendReminderEmail(email: string, serviceName: string, endDate: Date) {
  // This would be replaced with actual email sending logic
  // Example with SendGrid:
  //
  // const msg = {
  //   to: email,
  //   from: 'reminders@trialguard.com',
  //   subject: `Reminder: Your ${serviceName} trial is ending soon`,
  //   text: `Your ${serviceName} trial is ending on ${endDate.toLocaleDateString()}. Don't forget to cancel if you don't want to be charged.`,
  //   html: `<p>Your <strong>${serviceName}</strong> trial is ending on <strong>${endDate.toLocaleDateString()}</strong>. Don't forget to cancel if you don't want to be charged.</p>`,
  // };
  //
  // sgMail.send(msg);

  console.log(
    `[EMAIL] Would send reminder email to ${email} about ${serviceName} ending on ${endDate.toLocaleDateString()}`
  );
}
