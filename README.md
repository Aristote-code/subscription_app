# TrialGuard - Subscription Management App

TrialGuard is a modern web application that helps you track and manage your subscription trials and ongoing subscriptions to prevent unexpected charges. Never forget to cancel a free trial again!

## Features

- **Track Subscriptions**: Keep all your trial periods and recurring subscriptions in one place
- **Visual Status Indicators**: Quickly identify active, ending soon, and expired subscriptions
- **Smart Reminders**: Get notified before your free trials end
- **Cancellation Guidance**: Access step-by-step instructions for cancelling popular services
- **Community Contributions**: Share and benefit from other users' cancellation experiences
- **Detailed Subscription View**: Monitor trial progress, view key dates, and edit subscription details

## Tech Stack

- **Frontend**: Next.js 14+ with React and TypeScript
- **UI Components**: Shadcn UI library with Tailwind CSS
- **State Management**: React Hooks
- **Database**: SQL Server with Prisma ORM
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18.x or later
- SQL Server instance
- Git

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/trialguard.git
   cd trialguard
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory with the following:

   ```
   DATABASE_URL="sqlserver://localhost:1433;database=trialguard;user=sa;password=YourStrong@Passw0rd;trustServerCertificate=true"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. Initialize the database

   ```
   npx prisma migrate dev --name init
   ```

5. Start the development server

   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding a Subscription

1. Click the "Add Subscription" button
2. Select a service or enter a custom service name
3. Set the trial start date and either:
   - Specify the trial length in days, or
   - Set the end date directly
4. Set when you want to be reminded before the trial ends
5. Click "Add Subscription"

### Managing Subscriptions

- **View Details**: Click on any subscription row to view detailed information
- **Edit Subscription**: Within the details view, click "Edit" to modify subscription information
- **Delete Subscription**: Remove subscriptions you no longer want to track
- **Sort and Filter**: Organize your subscriptions by service name, end date, or status

### Cancellation Guide

The application provides step-by-step cancellation instructions for popular services. For other services:

1. Search for cancellation steps
2. Contribute your own cancellation instructions to help other users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
