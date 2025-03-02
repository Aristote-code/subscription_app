"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

type SocialButtonsProps = {
  callbackUrl?: string;
};

export function SocialButtons({
  callbackUrl = "/dashboard",
}: SocialButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await signIn("github", { callbackUrl });
    } catch (error) {
      console.error("Github sign in error:", error);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="w-full"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle className="mr-2 h-5 w-5" />
        )}
        Continue with Google
      </Button>

      <Button
        variant="outline"
        type="button"
        disabled={isGithubLoading}
        onClick={handleGithubSignIn}
        className="w-full"
      >
        {isGithubLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-5 w-5" />
        )}
        Continue with GitHub
      </Button>
    </div>
  );
}
