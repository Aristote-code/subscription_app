// Global type definitions for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY: string;
    RESEND_FROM_EMAIL: string;
    NEXT_PUBLIC_CURRENCY_SYMBOL: string;
    NEXT_PUBLIC_APP_URL: string;
    GROQ_API_KEY: string;
  }
}
