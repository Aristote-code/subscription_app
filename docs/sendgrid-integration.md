# SendGrid Email Integration

This document explains how the SendGrid email integration is set up in the TrialGuard application.

## Overview

The application uses SendGrid to send transactional emails for:

- Trial ending notifications
- Payment due reminders
- Subscription cancellation confirmations

## Setup Instructions

1. **Create a SendGrid Account**

   - Sign up at [SendGrid](https://sendgrid.com/)
   - Create an API key with "Mail Send" permissions

2. **Verify Sender Identity**

   - In SendGrid, navigate to Settings > Sender Authentication
   - Complete either domain authentication or single sender verification
   - The verified email must match what you use in SENDGRID_FROM_EMAIL

3. **Set Environment Variables**
   Add the following to your `.env` or `.env.local` file:
   ```
   SENDGRID_API_KEY="your_sendgrid_api_key_here"
   SENDGRID_FROM_EMAIL="your_verified_sender_email@example.com"
   NEXT_PUBLIC_CURRENCY_SYMBOL="$"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
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

- Check SendGrid dashboard for delivery stats and issues
- The application logs errors when sending emails fails
- For local testing, check that SendGrid API key is valid and sender email is verified
