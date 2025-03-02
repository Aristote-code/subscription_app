### `README.md` Content for TrialGuard

```markdown
# TrialGuard

TrialGuard is a subscription management web app built to help users track free trials, set reminders, and cancel subscriptions to avoid unexpected charges. With an intuitive interface and smart features, it ensures users never get charged for trials they forget to cancel.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Coding Standards](#coding-standards)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [References for AI](#references-for-ai)

## Project Overview
TrialGuard addresses the common problem of users forgetting to cancel free trials, leading to unwanted charges. Key functionalities include:
- Tracking subscriptions with trial start/end dates.
- Setting reminders before trials end (e.g., 5 days prior).
- Providing cancellation instructions for popular services and a search option for others.

The app is built with a focus on user experience (intuitive flows) and code quality (senior-level practices).

## Features
- **User Authentication:** Sign up, log in, and password recovery.
- **Dashboard:** View all subscriptions with trial end dates and statuses.
- **Subscription Management:** Add, edit, or delete subscriptions with trial details.
- **Reminders:** Email notifications before trials end.
- **Cancellation Guidance:** Pre-filled steps for popular services (e.g., AWS, Amazon) and a search/community-driven mechanism for others.
- **Settings:** Customize user profile and notification preferences.

## Tech Stack
- **Frontend:** Next.js (React), TypeScript, Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma
- **Authentication:** JWT
- **Reminders:** Node-Cron for scheduling, SendGrid for emails
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel

## Project Structure
The project follows a modular structure to keep code organized and maintainable:

```
trialguard/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Shadcn UI components
│   ├── pages/             # Next.js pages (e.g., dashboard.tsx)
│   │   └── api/           # API routes (e.g., subscriptions.ts)
│   ├── lib/               # Prisma setup and database utilities
│   ├── utils/             # Utility functions (e.g., date formatting)
│   ├── config/            # Configuration files (e.g., database.ts)
│   ├── styles/            # Global styles (e.g., globals.css)
│   └── types/             # TypeScript type definitions
├── prisma/                # Prisma schema and migrations
├── tests/                 # Unit and integration tests
├── public/                # Static assets (e.g., images)
├── .env                   # Environment variables
├── .cursorrules           # Cursor AI rules
└── README.md              # Project documentation
```

## Setup Instructions
Follow these steps to set up the project locally:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/trialguard.git
   cd trialguard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables (replace with your values):
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/trialguard"
     NEXTAUTH_SECRET="your-nextauth-secret"
     SENDGRID_API_KEY="your-sendgrid-api-key"
     ```

4. **Set Up the Database:**
   - Ensure PostgreSQL is installed and running.
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev --name init
     ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) to view the app.

## Coding Standards
These standards ensure consistency and quality across the codebase:

- **Indentation:** Use 2-space indentation.
- **Naming Conventions:** Use camelCase for variables, functions, and components.
- **TypeScript:** Define types/interfaces for all data (e.g., `interface Subscription { id: number; name: string; trialEnds: Date; }`).
- **Components:** Write functional components with React hooks (e.g., `useState`, `useEffect`).
- **Documentation:** Use JSDoc for all functions and components (e.g., `/** Component to display a subscription */`).
- **File Naming:** Use lowercase with hyphens for files (e.g., `subscription-card.tsx`).

## Development Guidelines
Follow these guidelines to maintain senior-level code quality:

- **Modularity:** Keep components small and focused (e.g., `SubscriptionCard` handles only rendering a subscription).
- **API Routes:** Use Next.js API routes for backend logic (e.g., `/api/subscriptions`).
  - Type requests and responses (e.g., `NextApiRequest`, `NextApiResponse`).
  - Return JSON with a consistent structure: `{ success: boolean, data: any, error?: string }`.
- **Database:** Use Prisma for all database operations.
  - Define models in `prisma/schema.prisma`.
  - Use async/await for queries (e.g., `await prisma.subscription.findMany()`).
- **Reminders:**
  - Schedule with `node-cron` to check trial end dates daily.
  - Send emails via SendGrid for reminders.
- **Shadcn UI:** Use components like `<Button>`, `<Table>`, and `<Drawer>` for a consistent look and accessibility.
- **Error Handling:** Handle errors gracefully (e.g., try-catch in API routes, display user-friendly messages).

## Testing
Testing ensures the app is reliable:

- **Unit Tests:** Use Jest for logic (e.g., subscription date calculations).
- **Component Tests:** Use React Testing Library for UI components.
- **API Tests:** Test API routes for success and error cases.
- **Setup:**
   ```bash
   npm run test
   ```

## Deployment
The app is deployed on Vercel:

1. Push code to your GitHub repository.
2. Connect the repository to Vercel.
3. Set environment variables in Vercel’s dashboard (same as `.env`).
4. Deploy with:
   ```bash
   vercel deploy
   ```

## Contributing
Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## References for AI
These references help the AI assist with development:

- @ src/config/database.ts (Database connection setup)
- @ src/components/SubscriptionCard.tsx (Example component)
- @ src/pages/api/subscriptions.ts (Example API route)
- @ tests/subscription.test.ts (Example test file)
```

---

### How to Use This

1. **Create or Open `README.md`:**
   - If you don’t already have a `README.md` in your project root (`trialguard/`), create one.
   - Open it in Cursor or your preferred editor.

2. **Paste the Content:**
   - Copy the Markdown content above and paste it into `README.md`.

3. **Customize as Needed:**
   - **Repository URL:** Replace `https://github.com/yourusername/trialguard.git` with your actual repository URL.
   - **Environment Variables:** Add any additional variables your app needs (e.g., for authentication or email services).
   - **References for AI:** Add more file references if there are other key files you want the AI to use as examples.

4. **Save the File:**
   - Save `README.md` to ensure the AI can reference it.

---

### Ensuring the AI Follows the `README`

- **Reference in Rules:** In your `subscription-app-rules.mdc`, you’ve already added a reference to the `README`:
  ```markdown
  ## References
  - @ ../README.md (Project overview and guidelines)
  ```
  This ensures the AI uses the `README` as a guide.
- **Auto Attach:** Your existing `Auto Attach` patterns (`*.ts,*.tsx,src/**/*/*.ts,src/**/*/*.tsx,src/config/**/*.json,*.test.ts,*.test.tsx`) ensure the rules apply to most files, so the AI will reference the `README` when relevant.
- **Prompt the AI:** When asking for help, you can mention the `README` explicitly (e.g., "Generate a new component following the guidelines in the README").
