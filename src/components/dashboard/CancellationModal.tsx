import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, RefreshCw, ChevronDown } from "lucide-react";
import { getCancellationSteps } from "@/services/cancellationService";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CancellationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  cancellationSteps: string[];
  onSaveSteps: (steps: string[]) => void;
}

const CancellationModal = ({
  open,
  onOpenChange,
  serviceName,
  cancellationSteps,
  onSaveSteps,
}: CancellationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [manualSteps, setManualSteps] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // If we already have cancellation steps, use them
      if (cancellationSteps && cancellationSteps.length > 0) {
        setSteps(cancellationSteps);
        setShowManualInput(false);
        setError(null);
      } else {
        // Otherwise, we need to generate them
        generateCancellationSteps();
      }
    }
  }, [open, cancellationSteps]);

  const generateCancellationSteps = async () => {
    if (!serviceName) return;

    setIsLoading(true);
    setShowManualInput(false);
    setError(null);

    try {
      // Call cancellation service to get steps
      const response = await getCancellationSteps(serviceName);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.steps && response.steps.length > 0) {
        setSteps(response.steps);
      } else {
        setShowManualInput(true);
      }
    } catch (error) {
      console.error("Error generating cancellation steps:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      toast({
        title: "Error",
        description:
          "Failed to generate cancellation steps. You can add them manually.",
        variant: "destructive",
      });
      setShowManualInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSave = () => {
    if (!manualSteps.trim()) {
      toast({
        title: "Error",
        description: "Please enter cancellation steps",
        variant: "destructive",
      });
      return;
    }

    // Split by new lines and filter empty lines
    const newSteps = manualSteps
      .split("\n")
      .map((step) => step.trim())
      .filter((step) => step.length > 0);

    setSteps(newSteps);
    setShowManualInput(false);

    // Save steps
    onSaveSteps(newSteps);

    toast({
      title: "Success",
      description: "Cancellation steps saved successfully",
    });
  };

  const handleSave = () => {
    onSaveSteps(steps);
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Cancellation steps saved successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] modal-transition">
        <DialogHeader>
          <DialogTitle>How to Cancel {serviceName}</DialogTitle>
          <DialogDescription>
            Follow these steps to cancel your subscription before the trial
            ends.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Generating detailed cancellation steps...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-destructive mb-4">{error}</p>
              <Button
                onClick={generateCancellationSteps}
                variant="outline"
                className="mr-2"
              >
                Try Again
              </Button>
              <Button onClick={() => setShowManualInput(true)}>
                Enter Steps Manually
              </Button>
            </div>
          ) : showManualInput ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We couldn't find cancellation steps for {serviceName}. Please
                add your own below:
              </p>
              <Textarea
                value={manualSteps}
                onChange={(e) => setManualSteps(e.target.value)}
                placeholder="Enter each step on a new line, e.g.:&#10;1. Log in to your account&#10;2. Go to Subscription settings&#10;3. Click Cancel Subscription"
                className="min-h-[250px]"
              />
              <Button onClick={handleManualSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Steps
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute right-4 top-1 text-xs text-muted-foreground flex items-center">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Scroll for more
                </div>
                <ScrollArea className="h-[250px] rounded-md border p-3">
                  <ol className="list-decimal list-outside pl-5 space-y-3 pr-2">
                    {steps.map((step, index) => (
                      <li key={index} className="text-sm leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              </div>

              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualInput(true)}
                >
                  Edit Steps
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateCancellationSteps}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Close
            </Button>
          </DialogClose>
          {!isLoading && !showManualInput && !error && (
            <Button type="button" onClick={handleSave}>
              Save & Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationModal;
