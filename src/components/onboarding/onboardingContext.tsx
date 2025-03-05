"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define the type for the onboarding steps
export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

// Define the type for the onboarding context
type OnboardingContextType = {
  steps: OnboardingStep[];
  currentStepIndex: number;
  isOnboardingComplete: boolean;
  isOnboardingVisible: boolean;
  showOnboarding: () => void;
  hideOnboarding: () => void;
  completeStep: (stepId: string) => void;
  resetOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
};

// Create the context with a default value
const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

// Define the default onboarding steps
const defaultSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to TrialGuard",
    description:
      "Track your subscriptions, get reminders before trials end, and never pay for services you don't use.",
    completed: false,
  },
  {
    id: "add-subscription",
    title: "Add Your Subscriptions",
    description:
      "Start by adding your current subscriptions and free trials. We'll help you keep track of them.",
    completed: false,
  },
  {
    id: "set-reminders",
    title: "Get Timely Reminders",
    description:
      "We'll send you reminders before your free trials end, so you can cancel if you don't want to continue.",
    completed: false,
  },
  {
    id: "cancel-subscriptions",
    title: "Easy Cancellation",
    description:
      "Find cancellation instructions for popular services or add your own notes for future reference.",
    completed: false,
  },
];

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  // Check if this is the first time the user is visiting
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboardingComplete");
    const isFirstVisit = !hasCompletedOnboarding;

    if (isFirstVisit) {
      // Show onboarding automatically on first visit
      setIsOnboardingVisible(true);
    } else {
      setIsOnboardingComplete(true);
    }
  }, []);

  const showOnboarding = () => {
    setIsOnboardingVisible(true);
  };

  const hideOnboarding = () => {
    setIsOnboardingVisible(false);
  };

  const completeStep = (stepId: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const resetOnboarding = () => {
    setSteps(defaultSteps);
    setCurrentStepIndex(0);
    setIsOnboardingComplete(false);
    localStorage.removeItem("onboardingComplete");
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      // Mark the current step as completed
      completeStep(steps[currentStepIndex].id);
      // Move to the next step
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // If we're at the last step, complete the onboarding
      completeStep(steps[currentStepIndex].id);
      setIsOnboardingComplete(true);
      setIsOnboardingVisible(false);
      localStorage.setItem("onboardingComplete", "true");
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const skipOnboarding = () => {
    setIsOnboardingComplete(true);
    setIsOnboardingVisible(false);
    localStorage.setItem("onboardingComplete", "true");
  };

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        currentStepIndex,
        isOnboardingComplete,
        isOnboardingVisible,
        showOnboarding,
        hideOnboarding,
        completeStep,
        resetOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
