import { prisma } from "@/lib/prisma";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Interface for reminder data
 */
interface ReminderData {
  id: string;
  date: Date;
  sent: boolean;
  subscriptionId: string;
  subscription: {
    id: string;
    name: string;
    trialEndDate: Date;
    cost: number;
    billingCycle: string;
    userId: string;
    user: {
      email: string;
      name: string | null;
    };
  };
}

/**
 * Check for due reminders and send notifications
 * This function should be called by a scheduled job
 */
export const checkAndSendReminders = async (): Promise<void> => {
  try {
    // Get all unsent reminders due today or earlier
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueReminders = await prisma.reminder.findMany({
      where: {
        date: {
          lte: today,
        },
        sent: false,
      },
      include: {
        subscription: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log(`Found ${dueReminders.length} reminders to send`);

    // Send email for each reminder
    for (const reminder of dueReminders) {
      await sendReminderEmail(reminder as unknown as ReminderData);

      // Mark reminder as sent
      await prisma.reminder.update({
        where: {
          id: reminder.id,
        },
        data: {
          sent: true,
        },
      });

      // Create notification in database
      await prisma.notification.create({
        data: {
          type: "reminder",
          title: `Trial ending soon: ${reminder.subscription.name}`,
          message: `Your free trial for ${
            reminder.subscription.name
          } will end on ${formatDate(
            reminder.subscription.trialEndDate
          )}. Don't forget to cancel if you don't want to be charged.`,
          userId: reminder.subscription.userId,
        },
      });
    }
  } catch (error) {
    console.error("Error checking and sending reminders:", error);
    throw error;
  }
};

/**
 * Send reminder email to user
 */
const sendReminderEmail = async (reminder: ReminderData): Promise<void> => {
  try {
    const { subscription } = reminder;
    const { user } = subscription;

    if (!process.env.SENDGRID_API_KEY) {
      console.warn("SendGrid API key not set, skipping email send");
      return;
    }

    const daysRemaining = getDaysRemaining(subscription.trialEndDate);
    const userName = user.name || "there";

    const msg = {
      to: user.email,
      from: "notifications@trialguard.com", // Replace with your verified sender
      subject: `Trial Ending Soon: ${subscription.name}`,
      text: `Hi ${userName},\n\nYour free trial for ${
        subscription.name
      } will end in ${daysRemaining} days on ${formatDate(
        subscription.trialEndDate
      )}. After this date, you will be charged $${subscription.cost} ${
        subscription.billingCycle
      }.\n\nIf you don't want to continue with this subscription, make sure to cancel before the trial ends.\n\nThanks,\nThe TrialGuard Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Trial Ending Soon</h2>
          <p>Hi ${userName},</p>
          <p>Your free trial for <strong>${
            subscription.name
          }</strong> will end in <strong>${daysRemaining} days</strong> on ${formatDate(
        subscription.trialEndDate
      )}.</p>
          <p>After this date, you will be charged <strong>$${
            subscription.cost
          } ${subscription.billingCycle}</strong>.</p>
          <p>If you don't want to continue with this subscription, make sure to cancel before the trial ends.</p>
          <div style="margin: 30px 0;">
            <a href="${
              process.env.NEXTAUTH_URL
            }/dashboard" style="background-color: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Subscription</a>
          </div>
          <p>Thanks,<br>The TrialGuard Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(
      `Reminder email sent for ${subscription.name} to ${user.email}`
    );
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
};

/**
 * Format date to readable string
 */
const formatDate = (date: Date | null): string => {
  if (!date) return "Unknown date";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

/**
 * Calculate days remaining until trial end
 */
const getDaysRemaining = (endDate: Date | null): number => {
  if (!endDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
