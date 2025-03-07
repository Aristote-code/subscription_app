# Resend Email Integration

This document explains how the Resend email integration is set up in the TrialGuard application.

## Overview

The application uses Resend to send transactional emails for:

- Trial ending notifications
- Payment due reminders
- Subscription cancellation confirmations

## Setup Instructions

1. **Create a Resend Account**

   - Sign up at [Resend](https://resend.com/)
   - Create an API key with appropriate permissions

2. **Verify a Sending Domain**

   - In Resend, navigate to Domains section
   - Add and verify your domain
   - The verified domain must be used in the "from" email address

3. **Set Environment Variables**
   Add the following to your `.env` or `.env.local` file:
   ```
   RESEND_API_KEY="your_resend_api_key_here"
   RESEND_FROM_EMAIL="your_verified_sender_email@example.com"
   NEXT_PUBLIC_CURRENCY_SYMBOL="$"
   APP_URL="http://localhost:3000"
   ```

## Using the Email Service

The application provides several utility functions for sending emails:

1. **General Email Function**

   ```typescript
   import { sendEmail } from "@/utils/email";

   await sendEmail({
     to: "user@example.com",
     template: "trialEnding", // or "paymentDue" or "subscriptionCancelled"
     variables: {
       serviceName: "Netflix",
       daysRemaining: "5",
       // other variables as needed by the template
     },
   });
   ```

2. **Specific Email Functions**

   ```typescript
   import {
     sendTrialEndingEmail,
     sendPaymentDueEmail,
     sendSubscriptionCancelledEmail,
   } from "@/utils/email";

   // Send trial ending notification
   await sendTrialEndingEmail({
     to: "user@example.com",
     serviceName: "Netflix",
     daysRemaining: 5,
     dashboardUrl: "https://yourdomain.com/dashboard",
   });
   ```

3. **API Endpoint**
   You can also trigger emails through the API:
   ```typescript
   await fetch("/api/notifications/email", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       type: "trialEnding",
       subscriptionId: "subscription-id",
     }),
   });
   ```

## Email Templates

The application includes three main email templates:

1. **Trial Ending**

   - Notifies users when a free trial is about to end
   - Includes subscription name and days remaining

2. **Payment Due**

   - Notifies users of upcoming subscription payments
   - Includes subscription name, amount, and due date

3. **Subscription Cancelled**
   - Confirms cancellation of a subscription
   - Includes subscription name and end date information

## Customizing Templates

To customize email templates, modify the `EMAIL_TEMPLATES` object in `src/utils/email.ts`:

```typescript
const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  trialEnding: {
    subject: "Your Trial is Ending Soon",
    text: "Your trial for {serviceName} ends in {daysRemaining} days...",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Trial is Ending Soon</h2>
        ...
      </div>
    `,
  },
  // other templates
};
```

## Monitoring and Debugging

- Check Resend dashboard for delivery stats and issues
- The application logs errors when sending emails fails
- For local testing, check that Resend API key is valid and sender email is verified
