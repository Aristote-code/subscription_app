"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  Plus,
  X,
  Pencil,
  Save,
  ExternalLink,
  CalendarIcon,
  PlusCircle,
  Trash,
  Eye,
  CalendarDays,
  ChevronDown,
  Check,
  Edit,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parseISO, addDays, differenceInDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddSubscriptionForm } from "@/components/add-subscription-form";

// Define the Subscription interface
interface Reminder {
  id: string;
  date: string | Date;
  sent: boolean;
  subscriptionId: string;
}

interface Subscription {
  id: string;
  name: string;
  description?: string;
  trialStartDate: Date | string;
  trialEndDate: Date | string;
  cost: number;
  billingCycle: string;
  status: string;
  cancellationUrl?: string;
  reminders?: Reminder[];
}

/**
 * Dashboard page component for displaying user's subscriptions
 */
export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("q") || "");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Update URL with search parameter
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Subscriptions</h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subscriptions..."
              className="pl-8 pr-4 bg-background border-input text-foreground placeholder:text-muted-foreground w-60"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-none shadow-none gap-1">
                <Plus className="h-4 w-4" />
                Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background border-border text-foreground">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Add New Subscription
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Track a new subscription or free trial
                </DialogDescription>
              </DialogHeader>
              <AddSubscriptionForm isDialog={true} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-8">
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardContent initialSearchTerm={searchTerm} />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardContent({ initialSearchTerm = "" }) {
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [editForm, setEditForm] = useState<Subscription | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // New state variables for reminder management
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderDate, setNewReminderDate] = useState<Date | undefined>(
    undefined
  );
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);

  // Sample cancellation instructions
  const cancellationInstructions = {
    Netflix: [
      "Log in to your Netflix account",
      "Click on your profile icon in the top right",
      "Select 'Account'",
      "Under 'Membership & Billing', click 'Cancel Membership'",
      "Confirm cancellation",
    ],
    Spotify: [
      "Log in to your Spotify account",
      "Go to your account page",
      "Click on 'Subscription' in the menu",
      "Scroll down to 'Your plan'",
      "Click 'CHANGE PLAN'",
      "Scroll down and click 'CANCEL PREMIUM'",
    ],
  };

  // Get search term from URL
  useEffect(() => {
    const query = searchParams?.get("q");
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Fetch subscriptions data from API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/subscriptions");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setSubscriptions(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch subscriptions");
        }
      } catch (err) {
        console.error("Failed to fetch subscriptions:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        // Set empty array to allow the app to function even with an error
        setSubscriptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  /**
   * Format date to readable string
   */
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  /**
   * Calculate days remaining until trial end
   */
  const getDaysRemaining = (endDate: Date | string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays;
  };

  /**
   * Get status badge class based on subscription status
   */
  const getStatusBadge = (status: string, endDate: Date | string) => {
    const daysRemaining = getDaysRemaining(endDate);

    if (daysRemaining < 0) {
      return (
        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
          Expired
        </Badge>
      );
    }

    if (daysRemaining < 7) {
      return (
        <Badge variant="secondary" className="bg-zinc-800 text-white">
          {daysRemaining} days left
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-zinc-800 text-white">
        {daysRemaining} days left
      </Badge>
    );
  };

  // Handle view details
  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setEditForm({ ...subscription });
    setIsDrawerOpen(true);
    fetchReminders(subscription.id);
  };

  // Handle edit form change
  const handleFormChange = (field: string, value: any) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: value,
      });
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (editForm) {
      try {
        const response = await fetch(`/api/subscriptions/${editForm.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Update subscription in the list
          const updatedSubscriptions = subscriptions.map((sub) =>
            sub.id === editForm.id ? data.data : sub
          );
          setSubscriptions(updatedSubscriptions);
          setSelectedSubscription(data.data);

          // Show success toast
          toast.success("Subscription updated successfully");
        } else {
          throw new Error(data.error || "Failed to update subscription");
        }
      } catch (err) {
        console.error("Failed to update subscription:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to update subscription"
        );
      }
    }
  };

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      sub.name.toLowerCase().includes(term) ||
      (sub.description && sub.description.toLowerCase().includes(term))
    );
  });

  // Fetch reminders for selected subscription
  const fetchReminders = async (subscriptionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/reminders?subscriptionId=${subscriptionId}`
      );
      const data = await response.json();

      if (data.success) {
        setReminders(data.data);
      } else {
        setReminderError(data.error || "Failed to fetch reminders");
      }
    } catch (error) {
      setReminderError("Failed to fetch reminders. Please try again.");
      console.error("Error fetching reminders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new reminder
  const handleAddReminder = async () => {
    if (!selectedSubscription || !newReminderDate) {
      setReminderError("Please select a date for the reminder");
      return;
    }

    try {
      setIsAddingReminder(true);

      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: selectedSubscription.id,
          date: newReminderDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReminders([...reminders, data.data]);
        setNewReminderDate(undefined);
        setReminderError(null);
      } else {
        setReminderError(data.error || "Failed to add reminder");
      }
    } catch (error) {
      setReminderError("Failed to add reminder. Please try again.");
      console.error("Error adding reminder:", error);
    } finally {
      setIsAddingReminder(false);
    }
  };

  // Delete a reminder
  const handleDeleteReminder = async (reminderId: string) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setReminders(reminders.filter((r) => r.id !== reminderId));
      } else {
        setReminderError(data.error || "Failed to delete reminder");
      }
    } catch (error) {
      setReminderError("Failed to delete reminder. Please try again.");
      console.error("Error deleting reminder:", error);
    }
  };

  // No subscriptions view
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No subscriptions found</h3>
          <p className="mb-6 mt-2 text-sm text-zinc-400">
            You haven't added any subscriptions yet.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border-none shadow-none gap-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-black border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Add New Subscription
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Track a new subscription or free trial
                </DialogDescription>
              </DialogHeader>
              <AddSubscriptionForm isDialog={true} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Loading view
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error view
  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-zinc-800 p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-500">
          Error loading subscriptions
        </h3>
        <p className="mb-6 text-sm text-zinc-400">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="bg-zinc-800 hover:bg-zinc-700 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Subscriptions view with data
  return (
    <div>
      <div className="rounded-md border border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-900 bg-black">
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow
                key={subscription.id}
                className="hover:bg-zinc-900 cursor-pointer"
                onClick={() => handleViewDetails(subscription)}
              >
                <TableCell className="font-medium">
                  {subscription.name}
                </TableCell>
                <TableCell>
                  {getStatusBadge(
                    subscription.status,
                    subscription.trialEndDate
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(subscription.trialEndDate)}{" "}
                  <span className="text-xs text-zinc-500">
                    ({getDaysRemaining(subscription.trialEndDate)})
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  ${subscription.cost.toFixed(2)}/{subscription.billingCycle}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(subscription);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Subscription Details Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent direction="right">
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-2xl">
                  {selectedSubscription?.name}
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DrawerClose>
              </div>
              <DrawerDescription>
                {selectedSubscription?.description}
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                  <TabsTrigger value="cancel">Cancel</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Trial Start Date
                      </h3>
                      <p>
                        {selectedSubscription &&
                          formatDate(selectedSubscription.trialStartDate)}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Trial End Date
                      </h3>
                      <p>
                        {selectedSubscription &&
                          formatDate(selectedSubscription.trialEndDate)}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Cost
                      </h3>
                      <p>
                        ${selectedSubscription?.cost.toFixed(2)}/
                        {selectedSubscription?.billingCycle}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Status
                      </h3>
                      <div>
                        {selectedSubscription &&
                          getStatusBadge(
                            selectedSubscription.status,
                            selectedSubscription.trialEndDate
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Reminder Settings
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="reminder"
                        checked={reminderEnabled}
                        onCheckedChange={(checked) => {
                          setReminderEnabled(checked);
                          toast.success(
                            checked
                              ? "Reminder enabled for this subscription"
                              : "Reminder disabled for this subscription"
                          );
                        }}
                      />
                      <label
                        htmlFor="reminder"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remind me 3 days before trial ends
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Notes
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      No notes added yet.
                    </p>
                  </div>
                </TabsContent>

                {/* Edit Tab */}
                <TabsContent value="edit" className="space-y-4 py-4">
                  {editForm && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            handleFormChange("name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="description"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Description
                        </label>
                        <Input
                          id="description"
                          value={editForm.description || ""}
                          onChange={(e) =>
                            handleFormChange("description", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="cost"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cost
                        </label>
                        <Input
                          id="cost"
                          type="number"
                          step="0.01"
                          value={editForm.cost}
                          onChange={(e) =>
                            handleFormChange("cost", parseFloat(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="billingCycle"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Billing Cycle
                        </label>
                        <Select
                          value={editForm.billingCycle}
                          onValueChange={(value) =>
                            handleFormChange("billingCycle", value)
                          }
                        >
                          <SelectTrigger id="billingCycle">
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="cancellationUrl"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cancellation URL
                        </label>
                        <Input
                          id="cancellationUrl"
                          value={editForm.cancellationUrl || ""}
                          onChange={(e) =>
                            handleFormChange("cancellationUrl", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                  <Button className="mt-4" onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </TabsContent>

                {/* Reminders Tab */}
                <TabsContent value="reminders">
                  <h3 className="text-xl font-bold mb-4">Manage Reminders</h3>

                  {reminderError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                      {reminderError}
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Add New Reminder</h4>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newReminderDate
                                ? format(newReminderDate, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newReminderDate}
                              onSelect={setNewReminderDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button
                        onClick={handleAddReminder}
                        disabled={isAddingReminder || !newReminderDate}
                      >
                        {isAddingReminder ? "Adding..." : "Add Reminder"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Scheduled Reminders</h4>
                    {reminders.length === 0 ? (
                      <p className="text-gray-500">No custom reminders set.</p>
                    ) : (
                      <div className="space-y-2">
                        {reminders.map((reminder) => (
                          <div
                            key={reminder.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div>
                              <p>
                                {formatDate(reminder.date)}
                                {reminder.sent && (
                                  <Badge variant="outline" className="ml-2">
                                    Sent
                                  </Badge>
                                )}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReminder(reminder.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Cancel Tab */}
                <TabsContent value="cancel" className="space-y-4 py-4">
                  <div className="rounded-md border bg-gray-800 p-4">
                    <h3 className="mb-2 font-medium">
                      How to cancel {selectedSubscription?.name}
                    </h3>
                    {selectedSubscription &&
                    cancellationInstructions[
                      selectedSubscription.name as keyof typeof cancellationInstructions
                    ] ? (
                      <ol className="ml-4 list-decimal space-y-2 text-gray-300">
                        {cancellationInstructions[
                          selectedSubscription.name as keyof typeof cancellationInstructions
                        ].map((step, index) => (
                          <li key={index} className="pl-1">
                            {step}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No specific cancellation instructions available for this
                        service. Visit the URL below to cancel.
                      </p>
                    )}
                  </div>

                  {selectedSubscription?.cancellationUrl && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Cancellation URL:
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                selectedSubscription?.cancellationUrl || ""
                              );
                              toast.success("URL copied to clipboard");
                            } catch (error) {
                              console.error("Failed to copy URL:", error);
                              toast.error("Failed to copy URL to clipboard");
                            }
                          }}
                        >
                          Copy URL
                        </Button>
                      </div>
                      <p className="break-all rounded-md border p-2 text-xs">
                        {selectedSubscription.cancellationUrl}
                      </p>
                      <div className="flex justify-center pt-4">
                        <Button
                          asChild
                          className="bg-red-600 hover:bg-red-500 text-white"
                        >
                          <Link
                            href={selectedSubscription?.cancellationUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!selectedSubscription?.cancellationUrl) {
                                e.preventDefault();
                                toast.error("No cancellation URL available");
                              }
                            }}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Go to Cancellation Page
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DrawerFooter>
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Close
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
