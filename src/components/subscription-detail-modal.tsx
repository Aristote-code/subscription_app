"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Clock,
  Bell,
  ExternalLink,
  Search,
  XCircle,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { differenceInDays, parseISO, format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Define cancellation steps for popular services
const CANCELLATION_STEPS: Record<
  string,
  { steps: string[]; directLink?: string }
> = {
  Netflix: {
    steps: [
      "Log in to your Netflix account",
      "Click on your profile icon in the top-right corner",
      "Select 'Account'",
      "Under 'Membership & Billing', click 'Cancel Membership'",
      "Follow the prompts to confirm cancellation",
    ],
    directLink: "https://www.netflix.com/cancelplan",
  },
  Spotify: {
    steps: [
      "Log in to your Spotify account on the website (not the app)",
      "Go to your account page",
      "Under 'Your plan', click 'Change plan'",
      "Scroll down to 'Cancel Premium' and click 'Cancel Premium'",
      "Follow the prompts to confirm cancellation",
    ],
    directLink: "https://www.spotify.com/account/overview/",
  },
  AWS: {
    steps: [
      "Log in to your AWS Management Console",
      "Go to the AWS Free Tier page",
      "Find the service you want to cancel",
      "Follow the service-specific cancellation steps",
      "Terminate all resources to avoid charges",
    ],
    directLink: "https://console.aws.amazon.com/billing/home#/freetier",
  },
};

interface Subscription {
  id: string;
  serviceName: string;
  trialStartDate: string;
  trialEndDate: string;
  reminderDays: number;
  status: "active" | "ending-soon" | "expired";
}

interface SubscriptionDetailModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (subscription: Subscription) => void;
}

export default function SubscriptionDetailModal({
  subscription,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
}: SubscriptionDetailModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubscription, setEditedSubscription] =
    useState<Subscription>(subscription);
  const [customCancellationSteps, setCustomCancellationSteps] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate days remaining
  const daysRemaining = differenceInDays(
    parseISO(subscription.trialEndDate),
    new Date()
  );

  // Calculate trial length in days
  const trialLength = differenceInDays(
    parseISO(subscription.trialEndDate),
    parseISO(subscription.trialStartDate)
  );

  // Calculate progress percentage
  const daysElapsed = trialLength - daysRemaining;
  const progressPercentage = Math.min(
    Math.max((daysElapsed / trialLength) * 100, 0),
    100
  );

  // Handle edit save
  const handleSave = () => {
    onUpdate(editedSubscription);
    setIsEditing(false);
    toast.success("Subscription updated");
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(subscription.id);
  };

  // Handle form changes for editing
  const handleChange = (field: keyof Subscription, value: any) => {
    setEditedSubscription({
      ...editedSubscription,
      [field]: value,
    });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsSearching(true);

    // Simulate a search - in a real app, this would call an API
    setTimeout(() => {
      setIsSearching(false);
      toast.success(`Search results for "${searchQuery}" would appear here`);
    }, 1500);
  };

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "ending-soon":
        return <Badge className="bg-yellow-500">Ending Soon</Badge>;
      case "expired":
        return <Badge className="bg-red-500">Expired</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{subscription.serviceName} Subscription</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 py-4">
            {isEditing ? (
              // Edit Form
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-service">Service Name</Label>
                  <Input
                    id="edit-service"
                    value={editedSubscription.serviceName}
                    onChange={(e) =>
                      handleChange("serviceName", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-start-date">Trial Start Date</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={editedSubscription.trialStartDate}
                    onChange={(e) =>
                      handleChange("trialStartDate", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-end-date">Trial End Date</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={editedSubscription.trialEndDate}
                    onChange={(e) =>
                      handleChange("trialEndDate", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-reminder">Reminder (days before)</Label>
                  <Input
                    id="edit-reminder"
                    type="number"
                    value={editedSubscription.reminderDays}
                    onChange={(e) =>
                      handleChange("reminderDays", parseInt(e.target.value))
                    }
                    min="0"
                    max="30"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              // View Details
              <>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-3">
                    <div className="font-medium">Trial Progress</div>
                    <div className="mt-2">
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <div>
                          {format(
                            parseISO(subscription.trialStartDate),
                            "MMM d, yyyy"
                          )}
                        </div>
                        <div>
                          {format(
                            parseISO(subscription.trialEndDate),
                            "MMM d, yyyy"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {daysRemaining > 0
                          ? `${daysRemaining} days remaining`
                          : `Expired ${Math.abs(daysRemaining)} days ago`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Service
                      </div>
                      <div className="mt-1">{subscription.serviceName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Status
                      </div>
                      <div className="mt-1">
                        {renderStatusBadge(subscription.status)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Start Date
                      </div>
                      <div className="mt-1">
                        {format(
                          parseISO(subscription.trialStartDate),
                          "MMM d, yyyy"
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        End Date
                      </div>
                      <div className="mt-1">
                        {format(
                          parseISO(subscription.trialEndDate),
                          "MMM d, yyyy"
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Reminder
                      </div>
                      <div className="mt-1 flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{subscription.reminderDays} days before</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Subscription ID
                      </div>
                      <div className="mt-1">{subscription.id}</div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Cancellation Tab */}
          <TabsContent value="cancellation" className="space-y-4 py-4">
            {CANCELLATION_STEPS[subscription.serviceName] ? (
              // Show pre-filled cancellation steps
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  How to Cancel {subscription.serviceName}
                </h3>

                {/* Steps */}
                <div className="space-y-2">
                  {CANCELLATION_STEPS[subscription.serviceName].steps.map(
                    (step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm mr-3">
                          {index + 1}
                        </div>
                        <div className="pt-0.5">{step}</div>
                      </div>
                    )
                  )}
                </div>

                {/* Direct Link */}
                {CANCELLATION_STEPS[subscription.serviceName].directLink && (
                  <div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          CANCELLATION_STEPS[subscription.serviceName]
                            .directLink,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to Cancellation Page
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">
                    Did these steps work for you?
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Thanks for your feedback!")}
                    >
                      Yes, they worked
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSearching(true)}
                    >
                      No, I need help
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Show search and community input for other services
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Find Cancellation Steps</h3>

                <form onSubmit={handleSearch} className="space-y-2">
                  <Label htmlFor="search">Search for cancellation steps</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="search"
                      placeholder={`How to cancel ${subscription.serviceName}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      type="submit"
                      disabled={isSearching || !searchQuery}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </form>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="custom-steps">
                    Add your own cancellation steps
                  </Label>
                  <Textarea
                    id="custom-steps"
                    placeholder="Type the step-by-step process here..."
                    value={customCancellationSteps}
                    onChange={(e) => setCustomCancellationSteps(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    className="w-full"
                    disabled={!customCancellationSteps}
                    onClick={() => {
                      toast.success(
                        "Cancellation steps saved. Thank you for contributing!"
                      );
                      setCustomCancellationSteps("");
                    }}
                  >
                    Share These Steps
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
