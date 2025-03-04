"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw, Home, ArrowLeft, Info } from "lucide-react";

/**
 * Props for the Error component
 */
interface ErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * Custom 500 Error page for handling server errors
 */
export default function Error({ error, reset }: ErrorProps) {
  // Log the error to the console in development
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="mx-auto rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>

        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="break-words">
            {error.message || "An unexpected error occurred"}
          </AlertDescription>
        </Alert>

        <p className="text-muted-foreground">
          We apologize for the inconvenience. Our team has been notified and is
          working to fix the issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Button onClick={reset}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="border-t pt-6 mt-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 text-xs text-muted-foreground">
        <p>
          If this problem persists, please contact our support team at{" "}
          <a
            href="mailto:support@trialguard.app"
            className="underline hover:text-primary"
          >
            support@trialguard.app
          </a>
        </p>
        <p className="mt-2">
          Error ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
