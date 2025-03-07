"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    console.log("[SIGNUP] Attempting to register user with email:", email);
    setIsLoading(true);

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log("[SIGNUP] Registration response status:", response.status);

      // Try to parse the response, but handle if it's not valid JSON
      let data;
      try {
        data = await response.json();
        console.log("[SIGNUP] Registration response data:", {
          success: data.success,
          message: data.message,
          error: data.error,
        });
      } catch (err) {
        console.error("[SIGNUP] Failed to parse response as JSON:", err);
        setDebugInfo(
          `Failed to parse response: ${err.message}. Status: ${response.status}`
        );
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log(
        "[SIGNUP] Registration successful, redirecting to login page"
      );
      toast.success("Account created successfully!");

      // Redirect to login page
      router.push(
        `/login?email=${encodeURIComponent(email)}&registrationSuccess=true`
      );
    } catch (error: any) {
      console.error("[SIGNUP] Registration error:", error);
      setError(error.message || "Something went wrong");
      setDebugInfo(
        `${error.message}\n\nStack: ${error.stack || "No stack trace"}`
      );
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">TrialGuard</span>
          </div>
          <h2 className="text-3xl font-bold text-center">Create an account</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Start tracking your subscriptions today
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {process.env.NODE_ENV === "development" && debugInfo && (
          <Alert
            variant="default"
            className="mb-4 border-yellow-500 bg-yellow-50 text-yellow-700"
          >
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription>
              <details>
                <summary>Debug Info</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40">
                  {debugInfo}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters with at least one
                  uppercase letter, one lowercase letter, and one number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked as boolean)
                  }
                  required
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I accept the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading ||
                  !name ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !acceptTerms
                }
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
