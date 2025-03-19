import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCancellationSteps } from "@/services/cancellationService";
import { Subscription } from "@/types/subscription";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";

interface SubscriptionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  onUpdate: (updatedSubscription: Subscription) => void;
  onDelete: (id: string) => void;
  activeTab?: string;
}

const SubscriptionDetailsModal = ({
  open,
  onOpenChange,
  subscription,
  onUpdate,
  onDelete,
  activeTab = "view",
}: SubscriptionDetailsModalProps) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [editedSubscription, setEditedSubscription] =
    useState<Subscription | null>(null);
  const [cancellationSteps, setCancellationSteps] = useState<string[]>([]);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [stepsError, setStepsError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualSteps, setManualSteps] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (open && subscription) {
      setEditedSubscription({ ...subscription });
      setCancellationSteps(subscription.cancellationSteps || []);
      setCurrentTab(activeTab);

      // If the cancellation steps are empty and we're on the cancellation tab, generate them
      if (
        (!subscription.cancellationSteps ||
          subscription.cancellationSteps.length === 0) &&
        (activeTab === "cancellation" || currentTab === "cancellation")
      ) {
        generateCancellationSteps();
      }
    }
  }, [open, subscription, activeTab]);

  const generateCancellationSteps = async () => {
    if (!subscription) return;

    setIsLoadingSteps(true);
    setStepsError(null);
    setShowManualInput(false);

    try {
      // Call cancellation service to get steps
      const response = await getCancellationSteps(subscription.serviceName);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.steps && response.steps.length > 0) {
        setCancellationSteps(response.steps);

        // Also update the subscription
        if (onUpdate) {
          onUpdate({
            ...subscription,
            cancellationSteps: response.steps,
          });
        }
      } else {
        setShowManualInput(true);
      }
    } catch (error) {
      console.error("Error generating cancellation steps:", error);
      setStepsError(
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
      setIsLoadingSteps(false);
    }
  };

  const handleManualSave = () => {
    if (!subscription || !manualSteps.trim()) {
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

    setCancellationSteps(newSteps);
    setShowManualInput(false);

    // Save steps to the subscription
    if (onUpdate) {
      onUpdate({
        ...subscription,
        cancellationSteps: newSteps,
      });
    }

    toast({
      title: "Success",
      description: "Cancellation steps saved successfully",
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedSubscription || !subscription) return;

    try {
      onUpdate({
        ...subscription,
        serviceName: editedSubscription.serviceName,
        startDate: editedSubscription.startDate,
        endDate: editedSubscription.endDate,
        trialDuration: editedSubscription.trialDuration,
        reminderDays: editedSubscription.reminderDays,
      });

      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!subscription) return;

    onDelete(subscription.id);
    onOpenChange(false);
    toast({
      title: "Subscription deleted",
      description: "The subscription has been removed from your account",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedSubscription) return;

    setEditedSubscription({
      ...editedSubscription,
      [e.target.name]: e.target.value,
    });
  };

  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{subscription.serviceName} Subscription</DialogTitle>
        </DialogHeader>

        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="view">View Details</TabsTrigger>
            <TabsTrigger value="edit">Edit Subscription</TabsTrigger>
            <TabsTrigger value="cancellation">Cancellation Steps</TabsTrigger>
          </TabsList>

          {/* View Tab */}
          <TabsContent value="view" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right font-medium">Service:</Label>
                <div className="col-span-3">{subscription.serviceName}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right font-medium">Price:</Label>
                <div className="col-span-3">
                  ${subscription.price} / {subscription.billingCycle}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right font-medium">Next billing:</Label>
                <div className="col-span-3">
                  {new Date(subscription.nextBillingDate).toLocaleDateString()}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right font-medium">Category:</Label>
                <div className="col-span-3">{subscription.category}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right font-medium">Notes:</Label>
                <div className="col-span-3">
                  {subscription.notes || "No notes"}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-4">
            {editedSubscription && (
              <form onSubmit={handleEditSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="serviceName" className="text-right">
                      Service Name
                    </Label>
                    <Input
                      id="serviceName"
                      name="serviceName"
                      value={editedSubscription.serviceName}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={editedSubscription.price}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="billingCycle" className="text-right">
                      Billing Cycle
                    </Label>
                    <Input
                      id="billingCycle"
                      name="billingCycle"
                      value={editedSubscription.billingCycle}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="nextBillingDate" className="text-right">
                      Next Billing Date
                    </Label>
                    <Input
                      id="nextBillingDate"
                      name="nextBillingDate"
                      type="date"
                      value={editedSubscription.nextBillingDate.substring(
                        0,
                        10
                      )}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={editedSubscription.category}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Input
                      id="notes"
                      name="notes"
                      value={editedSubscription.notes || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentTab("view")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </TabsContent>

          {/* Cancellation Tab */}
          <TabsContent value="cancellation" className="space-y-4">
            {isLoadingSteps ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">
                  Loading cancellation steps...
                </p>
              </div>
            ) : stepsError ? (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-sm text-destructive">{stepsError}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={generateCancellationSteps}
                >
                  Try Again
                </Button>
              </div>
            ) : showManualInput ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We couldn't find cancellation steps for{" "}
                  {subscription.serviceName}. Please add your own below:
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
                    <span>Scroll for more</span>
                  </div>
                  <ScrollArea className="h-[250px] rounded-md border p-3">
                    <ol className="list-decimal list-outside pl-5 space-y-3 pr-2">
                      {cancellationSteps.map((step, index) => (
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
                    onClick={() => setShowManualInput(true)}
                    size="sm"
                  >
                    Edit Steps
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export { SubscriptionDetailsModal };
