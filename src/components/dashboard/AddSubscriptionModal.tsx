import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CompanySearch from "./CompanySearch";
import { format, addDays } from "date-fns";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCancellationSteps } from "@/services/cancellationService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type Company = {
  id: string;
  name: string;
  country: string;
};

interface AddSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSubscription: (subscription: any) => void;
}

const trialDurations = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "90 days", value: 90 },
];

const AddSubscriptionModal = ({
  open,
  onOpenChange,
  onAddSubscription,
}: AddSubscriptionModalProps) => {
  const [serviceName, setServiceName] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [trialDuration, setTrialDuration] = useState<number>(30);
  const [reminderDays, setReminderDays] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
  const [cancellationError, setCancellationError] = useState<string | null>(
    null
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleCompanySelect = async (company: Company) => {
    setServiceName(company.name);
    // Start pre-generating cancellation steps as soon as a company is selected
    if (company.name) {
      preGenerateCancellationSteps(company.name);
    }
  };

  // Pre-generate steps when a company is selected to save time during submission
  const preGenerateCancellationSteps = async (name: string) => {
    setIsGeneratingSteps(true);
    setCancellationError(null);

    try {
      await getCancellationSteps(name);
      // We don't need to save the result here, just triggering the generation
      // to cache it and make the final submission faster
    } catch (error) {
      console.error("Error pre-generating cancellation steps:", error);
      // We don't show errors during pre-generation as it's a background optimization
    } finally {
      setIsGeneratingSteps(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !serviceName ||
      !startDate ||
      !trialDuration ||
      reminderDays === undefined
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setCancellationError(null);

    try {
      // Calculate end date based on start date and trial duration
      const endDate = addDays(startDate, trialDuration);

      // Create new subscription object
      const newSubscription = {
        id: Math.random().toString(36).substring(2, 11), // Just for demo
        serviceName,
        startDate,
        endDate,
        trialDuration,
        reminderDays,
        status: "active",
        cancellationSteps: [], // Will be populated by AI
      };

      // Show a toast to inform the user we're generating cancellation steps
      toast({
        title: "Generating Cancellation Steps",
        description:
          "Creating detailed instructions for cancelling this subscription...",
      });

      // Call the real cancellation service to get steps
      try {
        const response = await getCancellationSteps(serviceName);
        if (response.steps && response.steps.length > 0) {
          newSubscription.cancellationSteps = response.steps;
        } else {
          throw new Error("No valid cancellation steps returned");
        }
      } catch (error) {
        console.error("Error getting cancellation steps:", error);
        setCancellationError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );

        // Set default steps if there's an error
        newSubscription.cancellationSteps = [
          `Log in to your ${serviceName} account`,
          "Go to Account or Subscription settings",
          "Look for Cancel Subscription or Membership option",
          "Follow the prompts to confirm cancellation",
          "If you cannot find cancellation options, contact customer service",
        ];

        // Show a warning toast about the fallback steps
        toast({
          title: "Warning",
          description:
            "Using generic cancellation steps. You can update them later.",
          variant: "warning",
        });
      }

      // Add subscription
      onAddSubscription(newSubscription);

      // Success message
      toast({
        title: "Success",
        description: `Subscription for ${serviceName} added successfully.`,
      });

      // Reset form
      resetForm();

      // Close modal
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setServiceName("");
    setStartDate(new Date());
    setTrialDuration(30);
    setReminderDays(3);
    setCancellationError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] modal-transition">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Track a new free trial or subscription. You'll receive reminders
            before it ends.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name</Label>
              <CompanySearch
                onSelect={handleCompanySelect}
                value={serviceName}
                placeholder="Search for a service..."
              />
              {isGeneratingSteps && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  <span>Preparing cancellation guide...</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Trial Start Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date || new Date());
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trialDuration">Trial Duration</Label>
                <Select
                  value={trialDuration.toString()}
                  onValueChange={(value) => setTrialDuration(parseInt(value))}
                >
                  <SelectTrigger id="trialDuration" className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {trialDurations.map((duration) => (
                      <SelectItem
                        key={duration.value}
                        value={duration.value.toString()}
                      >
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderDays">Remind me</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="reminderDays"
                    type="number"
                    min={1}
                    max={30}
                    value={reminderDays}
                    onChange={(e) => setReminderDays(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    days before
                  </span>
                </div>
              </div>
            </div>

            {cancellationError && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  There was an issue generating detailed cancellation steps.
                  Generic steps will be used instead.
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {cancellationError}
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-secondary/50 p-3 rounded-md">
              <div className="text-sm font-medium mb-2">Trial Summary</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span>{format(startDate, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <span>
                    {format(addDays(startDate, trialDuration), "PPP")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reminder Date:</span>
                  <span>
                    {format(
                      addDays(startDate, trialDuration - reminderDays),
                      "PPP"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Subscription"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
