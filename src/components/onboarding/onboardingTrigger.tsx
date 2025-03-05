"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useOnboarding } from "./onboardingContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * OnboardingTrigger component provides a button to start or restart the onboarding process.
 * It can be placed in various locations throughout the app.
 */
export function OnboardingTrigger({
  variant = "default",
  size = "default",
  showIcon = true,
  showText = true,
  className = "",
}: {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}) {
  const { showOnboarding, resetOnboarding } = useOnboarding();

  const handleClick = () => {
    resetOnboarding();
    showOnboarding();
  };

  // If both icon and text are hidden, show at least the icon
  const actualShowIcon = showIcon || !showText;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={className}
          >
            {actualShowIcon && (
              <HelpCircle className={`${showText ? "mr-2" : ""} h-4 w-4`} />
            )}
            {showText && "App Tour"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Start the guided tour</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
