"use client";

import { useState, useEffect } from "react";
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
import { Search, Plus, X, Pencil, Save, ExternalLink } from "lucide-react";

// Define the Subscription interface
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
}

/**
 * Dashboard page component for displaying user's subscriptions
 */
export default function DashboardPage() {
  // State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [editForm, setEditForm] = useState<Subscription | null>(null);

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

  // Mock data
  useEffect(() => {
    const mockData: Subscription[] = [
      {
        id: "1",
        name: "Netflix",
        description: "Streaming service",
        trialStartDate: new Date(2023, 5, 1),
        trialEndDate: new Date(2023, 6, 1),
        cost: 15.99,
        billingCycle: "monthly",
        status: "active",
        cancellationUrl: "https://netflix.com/cancel",
      },
      {
        id: "2",
        name: "Spotify",
        description: "Music streaming",
        trialStartDate: new Date(2023, 5, 15),
        trialEndDate: new Date(2023, 6, 15),
        cost: 9.99,
        billingCycle: "monthly",
        status: "ending soon",
        cancellationUrl: "https://spotify.com/account",
      },
      {
        id: "3",
        name: "Disney+",
        description: "Streaming service",
        trialStartDate: new Date(2023, 4, 1),
        trialEndDate: new Date(2023, 5, 1),
        cost: 7.99,
        billingCycle: "monthly",
        status: "expired",
        cancellationUrl: "https://disneyplus.com/account",
      },
    ];

    setTimeout(() => {
      setSubscriptions(mockData);
      setIsLoading(false);
    }, 1000);
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

    if (status === "expired") {
      return <Badge variant="destructive">Expired</Badge>;
    }

    if (status === "cancelled") {
      return <Badge variant="outline">Cancelled</Badge>;
    }

    if (daysRemaining <= 3) {
      return <Badge variant="destructive">{daysRemaining} days left</Badge>;
    }

    if (daysRemaining <= 7) {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        >
          {daysRemaining} days left
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      >
        {daysRemaining} days left
      </Badge>
    );
  };

  // Handle view details
  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setEditForm({ ...subscription });
    setIsDrawerOpen(true);
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
  const handleSaveChanges = () => {
    if (editForm) {
      // Update subscription in the list
      const updatedSubscriptions = subscriptions.map((sub) =>
        sub.id === editForm.id ? editForm : sub
      );
      setSubscriptions(updatedSubscriptions);
      setSelectedSubscription(editForm);

      // Show success toast
      toast.success("Subscription updated successfully");
    }
  };

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Dashboard Content */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Your Subscriptions</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subscriptions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-500">
            <Link href="/add-subscription">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        </div>
      </div>

      {/* Subscriptions Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">No subscriptions found</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "You haven't added any subscriptions yet."}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          ) : (
            <Button asChild className="bg-green-600 hover:bg-green-500">
              <Link href="/add-subscription">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Subscription
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              A list of your recent subscriptions and trials.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trial Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {subscription.name}
                    {subscription.description && (
                      <div className="text-xs text-muted-foreground">
                        {subscription.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(subscription.trialStartDate)} -{" "}
                    {formatDate(subscription.trialEndDate)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      subscription.status,
                      subscription.trialEndDate
                    )}
                  </TableCell>
                  <TableCell>${subscription.cost.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">
                    {subscription.billingCycle}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(subscription)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
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
                      <Switch id="reminder" defaultChecked />
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
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedSubscription.cancellationUrl || ""
                            );
                            toast.success("URL copied to clipboard");
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
                            href={selectedSubscription.cancellationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
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
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
