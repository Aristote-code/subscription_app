"use client";

import React from "react";
import { useOnboarding } from "./onboardingContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  Bell,
  Tag,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/**
 * OnboardingModal component displays a step-by-step guide for new users
 * to help them understand the key features of the application.
 */
export function OnboardingModal() {
  const {
    steps,
    currentStepIndex,
    isOnboardingVisible,
    hideOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
  } = useOnboarding();

  if (!isOnboardingVisible) {
    return null;
  }

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Get the appropriate icon for the current step
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "welcome":
        return <BookOpen className="h-12 w-12 text-primary" />;
      case "add-subscription":
        return <Calendar className="h-12 w-12 text-primary" />;
      case "set-reminder":
        return <Bell className="h-12 w-12 text-primary" />;
      case "explore-categories":
        return <Tag className="h-12 w-12 text-primary" />;
      case "cancellation":
        return <FileText className="h-12 w-12 text-primary" />;
      default:
        return <BookOpen className="h-12 w-12 text-primary" />;
    }
  };

  // Get the appropriate content for the current step
  const getStepContent = (stepId: string) => {
    switch (stepId) {
      case "welcome":
        return (
          <div className="space-y-4">
            <p>
              Welcome to TrialGuard! We're excited to help you manage your
              subscriptions and free trials effectively.
            </p>
            <p>
              This quick tour will show you the key features of TrialGuard and
              help you get started.
            </p>
          </div>
        );
      case "add-subscription":
        return (
          <div className="space-y-4">
            <p>
              Start by adding your first subscription. Click the "Add
              Subscription" button on your dashboard.
            </p>
            <p>
              Enter details like the service name, trial start and end dates,
              cost, and billing cycle.
            </p>
            <div className="mt-4 p-4 bg-secondary/20 rounded-md">
              <h4 className="font-medium">Pro Tip:</h4>
              <p>
                Add subscriptions as soon as you sign up for them to never miss
                a trial end date.
              </p>
            </div>
          </div>
        );
      case "set-reminder":
        return (
          <div className="space-y-4">
            <p>
              Set up reminders to get notified before your trial ends. You can
              customize when you want to be reminded.
            </p>
            <p>
              We'll send you notifications so you can decide whether to keep the
              subscription or cancel it before being charged.
            </p>
            <div className="mt-4 p-4 bg-secondary/20 rounded-md">
              <h4 className="font-medium">Pro Tip:</h4>
              <p>
                We recommend setting reminders at least 3-5 days before the
                trial ends.
              </p>
            </div>
          </div>
        );
      case "explore-categories":
        return (
          <div className="space-y-4">
            <p>
              Keep your subscriptions organized with custom categories. Go to
              Settings and select "Categories Management".
            </p>
            <p>
              Create categories like "Entertainment", "Productivity", or
              "Shopping" to better track your spending.
            </p>
            <div className="mt-4 p-4 bg-secondary/20 rounded-md">
              <h4 className="font-medium">Pro Tip:</h4>
              <p>
                Use different colors for categories to quickly identify them on
                your dashboard.
              </p>
            </div>
          </div>
        );
      case "cancellation":
        return (
          <div className="space-y-4">
            <p>
              When you decide to cancel a subscription, TrialGuard provides
              step-by-step cancellation guides for popular services.
            </p>
            <p>
              For other services, you can search our community-driven database
              or add cancellation instructions yourself.
            </p>
            <div className="mt-4 p-4 bg-secondary/20 rounded-md">
              <h4 className="font-medium">Pro Tip:</h4>
              <p>
                Save the confirmation email when you cancel a subscription as
                proof.
              </p>
            </div>
          </div>
        );
      default:
        return <p>Learn more about TrialGuard's features.</p>;
    }
  };

  return (
    <Dialog open={isOnboardingVisible} onOpenChange={hideOnboarding}>
      <DialogContent className="sm:max-w-[500px] bg-background border-zinc-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{currentStep.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipOnboarding}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription>
            Step {currentStepIndex + 1} of {steps.length}
          </DialogDescription>
          <Progress value={progress} className="h-2 mt-2" />
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {getStepIcon(currentStep.id)}
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">{currentStep.description}</h3>
          </div>
          <div className="w-full text-left">
            {getStepContent(currentStep.id)}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={prevStep} className="mr-2">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={skipOnboarding}>
              Skip Tour
            </Button>
            <Button onClick={nextStep}>
              {currentStepIndex < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                "Finish"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
