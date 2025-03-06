"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/**
 * Custom hook to handle login redirection
 * This hook checks if a user is authenticated and redirects to the dashboard if they are
 * @param redirectToPath Path to redirect to if authenticated
 * @param debugMode Enable debug logs
 */
export function useLoginRedirect(
  redirectToPath = "/dashboard",
  debugMode = false
) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Debug information
    if (debugMode) {
      console.log("[useLoginRedirect] Auth status:", status);
      console.log("[useLoginRedirect] Session:", session);
    }

    // Only redirect when we have determined the user is authenticated
    if (status === "authenticated" && session) {
      if (debugMode) {
        console.log(
          "[useLoginRedirect] User is authenticated, redirecting to",
          redirectToPath
        );
      }

      // Show toast message
      toast.success(`Welcome back, ${session.user?.name || "User"}!`);

      // Use setTimeout to ensure toast is shown before redirect
      setTimeout(() => {
        router.push(redirectToPath);
        router.refresh(); // Refresh to ensure all components are updated
      }, 500);
    }
  }, [session, status, router, redirectToPath, debugMode]);

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    session,
  };
}
