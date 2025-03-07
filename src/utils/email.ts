import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email template types
 */
export type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

/**
 * Email templates for different notification types
 */
const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  trialEnding: {
    subject: "Your Trial is Ending Soon",
    text: "Your trial for {serviceName} ends in {daysRemaining} days. Don't forget to cancel if you don't want to be charged!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Trial is Ending Soon</h2>
        <p>Your trial for <strong>{serviceName}</strong> ends in <strong>{daysRemaining} days</strong>.</p>
        <p>Don't forget to cancel if you don't want to be charged!</p>
        <p>Click here to view your subscription: <a href="{dashboardUrl}">View Subscription</a></p>
      </div>
    `,
  },
  paymentDue: {
    subject: "Upcoming Subscription Payment",
    text: "Your subscription payment for {serviceName} is due in {daysRemaining} days.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Upcoming Subscription Payment</h2>
        <p>Your subscription payment for <strong>{serviceName}</strong> is due in <strong>{daysRemaining} days</strong>.</p>
        <p>Amount: ${process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{amount}</p>
        <p>Click here to view your subscription: <a href="{dashboardUrl}">View Subscription</a></p>
      </div>
    `,
  },
  subscriptionCancelled: {
    subject: "Subscription Cancelled",
    text: "Your subscription to {serviceName} has been cancelled successfully.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Subscription Cancelled</h2>
        <p>Your subscription to <strong>{serviceName}</strong> has been cancelled successfully.</p>
        <p>You will continue to have access until the end of your current billing period.</p>
        <p>Click here to view your subscriptions: <a href="{dashboardUrl}">View Subscriptions</a></p>
      </div>
    `,
  },
};

/**
 * Replace template variables with actual values
 */
function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  return Object.entries(variables).reduce(
    (str, [key, value]) => str.replace(new RegExp(`{${key}}`, "g"), value),
    template
  );
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  template,
  variables,
}: {
  to: string;
  template: keyof typeof EMAIL_TEMPLATES;
  variables: Record<string, string>;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("Resend API key is not configured");
      return false;
    }

    const emailTemplate = EMAIL_TEMPLATES[template];
    if (!emailTemplate) {
      console.error(`Email template "${template}" not found`);
      return false;
    }

    const subject = replaceTemplateVariables(emailTemplate.subject, variables);
    const html = replaceTemplateVariables(emailTemplate.html, variables);
    const text = replaceTemplateVariables(emailTemplate.text, variables);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "notifications@trialguard.com",
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Error sending email with Resend:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Send a trial ending notification email
 */
export async function sendTrialEndingEmail({
  to,
  serviceName,
  daysRemaining,
  dashboardUrl,
}: {
  to: string;
  serviceName: string;
  daysRemaining: number;
  dashboardUrl: string;
}) {
  return sendEmail({
    to,
    template: "trialEnding",
    variables: {
      serviceName,
      daysRemaining: daysRemaining.toString(),
      dashboardUrl,
    },
  });
}

/**
 * Send a payment due notification email
 */
export async function sendPaymentDueEmail({
  to,
  serviceName,
  daysRemaining,
  amount,
  dashboardUrl,
}: {
  to: string;
  serviceName: string;
  daysRemaining: number;
  amount: number;
  dashboardUrl: string;
}) {
  return sendEmail({
    to,
    template: "paymentDue",
    variables: {
      serviceName,
      daysRemaining: daysRemaining.toString(),
      amount: amount.toString(),
      dashboardUrl,
    },
  });
}

/**
 * Send a subscription cancelled confirmation email
 */
export async function sendSubscriptionCancelledEmail({
  to,
  serviceName,
  dashboardUrl,
}: {
  to: string;
  serviceName: string;
  dashboardUrl: string;
}) {
  return sendEmail({
    to,
    template: "subscriptionCancelled",
    variables: {
      serviceName,
      dashboardUrl,
    },
  });
}
