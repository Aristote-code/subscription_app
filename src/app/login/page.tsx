"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error") || "";
  const registrationSuccess =
    searchParams.get("registrationSuccess") === "true";
  const emailFromParams = searchParams.get("email") || "";

  // Pre-fill email from URL parameters
  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
      console.log(
        "[LOGIN] Pre-filled email from URL parameter:",
        emailFromParams
      );
    }

    if (registrationSuccess) {
      setSuccessMessage(
        "Your account has been created successfully! Please log in."
      );
      console.log("[LOGIN] Showing registration success message");
    }

    if (urlError) {
      console.log("[LOGIN] URL error parameter present:", urlError);
    }
  }, [emailFromParams, registrationSuccess, urlError]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDebugInfo(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    console.log("[LOGIN] Attempting login for email:", email);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("[LOGIN] SignIn result:", {
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url,
      });

      if (result?.error) {
        setError(result.error);
        setDebugInfo(`Error status: ${result.status || "unknown"}`);
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully!");
        console.log("[LOGIN] Login successful, redirecting to:", callbackUrl);
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error: any) {
      console.error("[LOGIN] Login error:", error);
      setError(error.message || "Something went wrong");
      setDebugInfo(`Error: ${JSON.stringify(error, null, 2)}`);
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
          <h2 className="text-3xl font-bold text-center">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Welcome back! Please enter your details.
          </p>
        </div>

        {(error || urlError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error ||
                (urlError === "CredentialsSignin"
                  ? "Invalid email or password"
                  : urlError === "SessionRequired"
                  ? "You need to be signed in to access this page"
                  : "An error occurred")}
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert
            variant="default"
            className="mb-4 border-green-500 bg-green-50 text-green-700"
          >
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription>{successMessage}</AlertDescription>
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
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus={!emailFromParams}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus={!!emailFromParams}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
