"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface CancellationGuideProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

const CancellationGuide = ({
  isOpen,
  onClose,
  serviceName,
}: CancellationGuideProps) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (isOpen && serviceName && !manualMode) {
      fetchCancellationGuide();
    }
  }, [isOpen, serviceName, manualMode]);

  const fetchCancellationGuide = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/cancellation-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceName }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({
            error: `Server responded with status: ${response.status}`,
          }));
        throw new Error(
          errorData.error || "Failed to fetch cancellation guide"
        );
      }

      const data = await response.json();

      if (
        !data.steps ||
        !Array.isArray(data.steps) ||
        data.steps.length === 0
      ) {
        throw new Error("No valid cancellation steps returned");
      }

      setSteps(data.steps);
    } catch (err: any) {
      console.error("Error fetching cancellation guide:", err);

      if (err.name === "AbortError") {
        setError("Request timed out. Please try again or use manual mode.");
      } else if (
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("NetworkError")
      ) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          err.message ||
            "Failed to generate cancellation steps. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    fetchCancellationGuide();
  };

  const handleManualMode = () => {
    setManualMode(true);
    setError(null);
    setSteps([
      "Visit the service provider website and log in to your account",
      'Navigate to "Account Settings" or "Subscription Management"',
      'Look for "Cancel Subscription" or similar option',
      "Follow the on-screen instructions to confirm cancellation",
      "Save or screenshot any confirmation for your records",
    ]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Cancel {serviceName}</DialogTitle>
          <DialogDescription>
            Follow these steps to cancel your subscription before the trial
            ends.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
              <p className="mb-4">{error}</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleTryAgain}>
                  Try Again
                </Button>
                <Button onClick={handleManualMode}>Enter Steps Manually</Button>
              </div>
            </div>
          ) : steps.length > 0 ? (
            <ol className="space-y-2 pl-5 list-decimal">
              {steps.map((step, index) => (
                <li key={index} className="text-sm">
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <p>Loading cancellation steps...</p>
            </div>
          )}
        </div>

        <DialogClose asChild>
          <Button className="w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationGuide;
