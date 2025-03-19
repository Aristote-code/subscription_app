import { format } from "date-fns";

type SendReminderProps = {
  email: string;
  serviceName: string;
  endDate: string;
  daysRemaining: number;
  cancellationSteps: string[];
};

export const sendReminderEmail = async ({
  email,
  serviceName,
  endDate,
  daysRemaining,
  cancellationSteps,
}: SendReminderProps): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> => {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not defined in environment variables");
    }

    // Format the end date
    const formattedEndDate = format(new Date(endDate), "MMMM d, yyyy");

    // Generate HTML for cancellation steps
    const stepsHtml =
      cancellationSteps && cancellationSteps.length > 0
        ? `
        <h2 style="font-size: 18px; margin-top: 24px; margin-bottom: 12px;">How to Cancel</h2>
        <ol style="padding-left: 24px;">
          ${cancellationSteps
            .map((step) => `<li style="margin-bottom: 8px;">${step}</li>`)
            .join("")}
        </ol>
      `
        : "";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Your ${serviceName} Trial Ends in ${daysRemaining} Days!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="font-size: 24px; color: #333; margin-bottom: 16px;">Your ${serviceName} Trial Ends Soon!</h1>
            
            <p style="margin-bottom: 24px; font-size: 16px; line-height: 1.5;">
              Your ${serviceName} trial is set to end on <strong>${formattedEndDate}</strong> 
              (${daysRemaining} ${
          daysRemaining === 1 ? "day" : "days"
        } from now).
            </p>
            
            ${stepsHtml}
            
            <div style="margin-top: 32px; text-align: center;">
              <a href="${appUrl}/dashboard" 
                 style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Manage Your Subscription
              </a>
            </div>
            
            <p style="margin-top: 32px; font-size: 14px; color: #666; text-align: center;">
              This email was sent by TrialGuard, your subscription management assistant.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API returned ${response.status}`);
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("Error sending reminder:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send reminder email",
    };
  }
};
