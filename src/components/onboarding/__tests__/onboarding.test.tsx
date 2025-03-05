import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  OnboardingProvider,
  OnboardingModal,
  OnboardingTrigger,
} from "../index";

// Mock the localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock the Dialog component since it uses portals which are not available in the test environment
jest.mock("@/components/ui/dialog", () => {
  return {
    Dialog: ({
      children,
      open,
    }: {
      children: React.ReactNode;
      open: boolean;
    }) => (open ? <div data-testid="dialog">{children}</div> : null),
    DialogContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-content">{children}</div>
    ),
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-header">{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-title">{children}</div>
    ),
    DialogDescription: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-description">{children}</div>
    ),
    DialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-footer">{children}</div>
    ),
  };
});

// Mock the Tooltip component
jest.mock("@/components/ui/tooltip", () => {
  return {
    Tooltip: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tooltip">{children}</div>
    ),
    TooltipContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tooltip-content">{children}</div>
    ),
    TooltipProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tooltip-provider">{children}</div>
    ),
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tooltip-trigger">{children}</div>
    ),
  };
});

// Mock the Progress component
jest.mock("@/components/ui/progress", () => {
  return {
    Progress: ({ value }: { value: number }) => (
      <div data-testid="progress" data-value={value}></div>
    ),
  };
});

// Mock the Button component
jest.mock("@/components/ui/button", () => {
  return {
    Button: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => (
      <button data-testid="button" onClick={onClick}>
        {children}
      </button>
    ),
  };
});

describe("Onboarding Components", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("OnboardingProvider", () => {
    it("provides onboarding context to children", () => {
      const TestComponent = () => {
        const { isOnboardingVisible } =
          require("../onboardingContext").useOnboarding();
        return (
          <div data-testid="test-component">
            {isOnboardingVisible.toString()}
          </div>
        );
      };

      render(
        <OnboardingProvider>
          <TestComponent />
        </OnboardingProvider>
      );

      expect(screen.getByTestId("test-component")).toHaveTextContent("true");
    });
  });

  describe("OnboardingTrigger", () => {
    it("renders a button to trigger onboarding", () => {
      render(
        <OnboardingProvider>
          <OnboardingTrigger />
        </OnboardingProvider>
      );

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("App Tour");
    });

    it("shows onboarding when clicked", () => {
      render(
        <OnboardingProvider>
          <OnboardingTrigger />
          <OnboardingModal />
        </OnboardingProvider>
      );

      // Initially, the modal should be visible for new users
      expect(screen.getByTestId("dialog")).toBeInTheDocument();

      // Hide the onboarding
      const skipButton = screen
        .getAllByTestId("button")
        .find((button) => button.textContent?.includes("Skip Tour"));
      fireEvent.click(skipButton!);

      // The modal should now be hidden
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();

      // Click the trigger button to show the onboarding again
      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      // The modal should be visible again
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  describe("OnboardingModal", () => {
    it("displays the current step", () => {
      render(
        <OnboardingProvider>
          <OnboardingModal />
        </OnboardingProvider>
      );

      // The first step should be displayed
      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "Welcome to TrialGuard"
      );
    });

    it("allows navigation between steps", () => {
      render(
        <OnboardingProvider>
          <OnboardingModal />
        </OnboardingProvider>
      );

      // Initially on the first step
      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "Welcome to TrialGuard"
      );

      // Click the Next button
      const nextButton = screen
        .getAllByTestId("button")
        .find((button) => button.textContent?.includes("Next"));
      fireEvent.click(nextButton!);

      // Should now be on the second step
      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "Add Your First Subscription"
      );

      // Click the Previous button
      const prevButton = screen
        .getAllByTestId("button")
        .find((button) => button.textContent?.includes("Previous"));
      fireEvent.click(prevButton!);

      // Should be back on the first step
      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "Welcome to TrialGuard"
      );
    });

    it("completes onboarding when finishing all steps", () => {
      render(
        <OnboardingProvider>
          <OnboardingModal />
        </OnboardingProvider>
      );

      // Navigate through all steps
      for (let i = 0; i < 4; i++) {
        const nextButton = screen
          .getAllByTestId("button")
          .find((button) => button.textContent?.includes("Next"));
        fireEvent.click(nextButton!);
      }

      // On the last step, click Finish
      const finishButton = screen
        .getAllByTestId("button")
        .find((button) => button.textContent?.includes("Finish"));
      fireEvent.click(finishButton!);

      // The modal should now be hidden
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });
  });
});
