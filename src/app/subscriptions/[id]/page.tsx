"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, addMonths, addYears, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileText,
  History,
  Info,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Bell,
  AlertTriangle,
  Edit,
  HelpCircle,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Interface for Subscription data
 */
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
  category?: string;
  logoUrl?: string;
  paymentMethod?: string;
  autoRenew: boolean;
  lastBillingDate?: Date | string;
  nextBillingDate?: Date | string;
}

/**
 * Interface for Reminder data
 */
interface Reminder {
  id: string;
  subscriptionId: string;
  reminderDate: Date | string;
  message: string;
  sent: boolean;
}

/**
 * Interface for Payment History
 */
interface PaymentRecord {
  id: string;
  date: Date | string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

/**
 * Subscription Details Page
 * Displays all information about a specific subscription
 */
export default function SubscriptionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [cancellationGuide, setCancellationGuide] = useState<string | null>(
    null
  );

  /**
   * Fetch subscription details and related data
   */
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        setIsLoading(true);

        // Fetch subscription details
        const response = await fetch(`/api/subscriptions/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch subscription details");
        }

        const data = await response.json();
        setSubscription(data.data);

        // Fetch reminders
        const remindersResponse = await fetch(
          `/api/reminders?subscriptionId=${params.id}`
        );
        if (remindersResponse.ok) {
          const remindersData = await remindersResponse.json();
          setReminders(remindersData.data || []);
        }

        // Generate mock payment history for now
        // In a real app, this would be fetched from an API
        generateMockPaymentHistory(data.data);

        // Try to fetch cancellation guide if available
        if (data.data.name) {
          try {
            const guideResponse = await fetch(
              `/api/cancellation-guides?service=${encodeURIComponent(
                data.data.name
              )}`
            );
            if (guideResponse.ok) {
              const guideData = await guideResponse.json();
              if (guideData.data && guideData.data.length > 0) {
                setCancellationGuide(guideData.data[0].steps);
              }
            }
          } catch (error) {
            console.error("Error fetching cancellation guide:", error);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load subscription details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [params.id]);

  /**
   * Generate mock payment history based on subscription details
   */
  const generateMockPaymentHistory = (subscription: Subscription) => {
    if (!subscription || !subscription.trialEndDate) return;

    const mockHistory: PaymentRecord[] = [];
    let currentDate = new Date();

    // Convert trial end date to Date object if it's a string
    const trialEndDate =
      typeof subscription.trialEndDate === "string"
        ? new Date(subscription.trialEndDate)
        : subscription.trialEndDate;

    // Add payment after trial end
    mockHistory.push({
      id: `payment-${Date.now()}-1`,
      date: new Date(trialEndDate),
      amount: subscription.cost,
      status: "completed",
    });

    // Add additional payments based on billing cycle
    let nextDate;
    if (subscription.billingCycle === "monthly") {
      nextDate = addMonths(trialEndDate, 1);
      mockHistory.push({
        id: `payment-${Date.now()}-2`,
        date: nextDate,
        amount: subscription.cost,
        status: "completed",
      });

      nextDate = addMonths(nextDate, 1);
      mockHistory.push({
        id: `payment-${Date.now()}-3`,
        date: nextDate,
        amount: subscription.cost,
        status: currentDate < nextDate ? "pending" : "completed",
      });
    } else if (subscription.billingCycle === "yearly") {
      nextDate = addYears(trialEndDate, 1);
      mockHistory.push({
        id: `payment-${Date.now()}-2`,
        date: nextDate,
        amount: subscription.cost,
        status: currentDate < nextDate ? "pending" : "completed",
      });
    }

    setPaymentHistory(mockHistory);
  };

  /**
   * Handle deleting the subscription
   */
  const handleDelete = async () => {
    if (!subscription) return;

    if (!confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }

      toast.success("Subscription deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete subscription");
    }
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  /**
   * Format date
   */
  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMMM d, yyyy");
  };

  /**
   * Calculate time until trial ends
   */
  const getTrialTimeRemaining = () => {
    if (!subscription || !subscription.trialEndDate) return null;

    const endDate = new Date(subscription.trialEndDate);
    const daysRemaining = differenceInDays(endDate, new Date());

    if (daysRemaining < 0) return "Trial ended";
    if (daysRemaining === 0) return "Trial ends today";
    return `${daysRemaining} days remaining`;
  };

  /**
   * Handle adding a new reminder
   */
  const handleAddReminder = async () => {
    if (!subscription) return;

    // The actual form would be in a modal or drawer
    // For now, just navigate to a page to add a reminder
    router.push(`/reminders/new?subscriptionId=${subscription.id}`);
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Subscription not found. It may have been deleted."}
            </AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const trialStatus =
    subscription.status === "active" &&
    subscription.trialEndDate &&
    new Date(subscription.trialEndDate) > new Date()
      ? "trial"
      : subscription.status;

  const isTrialEnding =
    trialStatus === "trial" &&
    differenceInDays(new Date(subscription.trialEndDate), new Date()) <= 3;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="p-0 h-9 mb-2"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">{subscription.name}</h1>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                trialStatus === "trial"
                  ? "secondary"
                  : subscription.status === "active"
                  ? "success"
                  : subscription.status === "canceled"
                  ? "destructive"
                  : "outline"
              }
            >
              {trialStatus === "trial" ? "Trial" : subscription.status}
            </Badge>
            {isTrialEnding && (
              <Badge variant="warning" className="bg-yellow-500">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Trial ending soon
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/add-subscription?edit=${subscription.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs
        defaultValue="details"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  Subscription Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p>{subscription.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p>{subscription.category || "Uncategorized"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="flex items-center">
                    {subscription.status === "active" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Active
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Canceled
                      </>
                    )}
                  </p>
                </div>
                {subscription.cancellationUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Cancellation URL
                    </p>
                    <a
                      href={subscription.cancellationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      Visit website to cancel
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                )}
                {subscription.autoRenew !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Auto Renewal
                    </p>
                    <p className="flex items-center">
                      {subscription.autoRenew ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Disabled
                        </>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(subscription.cost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Billing Cycle
                  </p>
                  <p className="capitalize">{subscription.billingCycle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Payment Method
                  </p>
                  <p>{subscription.paymentMethod || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Annual Cost
                  </p>
                  <p className="font-semibold">
                    {subscription.billingCycle === "monthly"
                      ? formatCurrency(subscription.cost * 12)
                      : formatCurrency(subscription.cost)}
                  </p>
                </div>
                {subscription.nextBillingDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Next Billing Date
                    </p>
                    <p>{formatDate(subscription.nextBillingDate)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trial Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Trial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Trial Start Date
                  </p>
                  <p>{formatDate(subscription.trialStartDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Trial End Date
                  </p>
                  <p>{formatDate(subscription.trialEndDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Trial Status
                  </p>
                  <div className="flex items-center">
                    {trialStatus === "trial" ? (
                      <Badge className="bg-blue-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {getTrialTimeRemaining()}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Trial ended</Badge>
                    )}
                  </div>
                </div>
                {isTrialEnding && (
                  <Alert className="mt-2 bg-yellow-50 border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">
                      Trial ending soon
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Your trial will end in{" "}
                      {differenceInDays(
                        new Date(subscription.trialEndDate),
                        new Date()
                      )}{" "}
                      days. Remember to cancel if you don't want to be charged.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href={`/add-subscription?edit=${subscription.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Subscription
                  </Link>
                </Button>
                <Button
                  onClick={handleAddReminder}
                  variant="outline"
                  className="w-full"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
                {subscription.cancellationUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={subscription.cancellationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to Cancellation Page
                    </a>
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Subscription
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <span>Added: {formatDate(subscription.trialStartDate)}</span>
                <span>ID: {subscription.id.substring(0, 8)}</span>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Payment History
              </CardTitle>
              <CardDescription>
                Track all your payments for this subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "completed"
                                  ? "success"
                                  : payment.status === "pending"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No payment history available
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment records will appear here once available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Subscription Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Monthly Cost
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {subscription.billingCycle === "monthly"
                          ? formatCurrency(subscription.cost)
                          : formatCurrency(subscription.cost / 12)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Annual Cost
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {subscription.billingCycle === "monthly"
                          ? formatCurrency(subscription.cost * 12)
                          : formatCurrency(subscription.cost)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Cost per Day
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {subscription.billingCycle === "monthly"
                          ? formatCurrency((subscription.cost * 12) / 365)
                          : formatCurrency(subscription.cost / 365)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Reminders
                </CardTitle>
                <CardDescription>
                  Manage reminders for this subscription
                </CardDescription>
              </div>
              <Button size="sm" onClick={handleAddReminder}>
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </CardHeader>
            <CardContent>
              {reminders.length > 0 ? (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <Card key={reminder.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  reminder.sent ? "secondary" : "outline"
                                }
                              >
                                {reminder.sent ? "Sent" : "Pending"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(reminder.reminderDate)}
                              </span>
                            </div>
                            <p className="font-medium">{reminder.message}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No reminders set</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the button above to add a reminder
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    onClick={handleAddReminder}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Reminder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                About Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up reminders to notify you before your trial ends or when a
                payment is due. Reminders can be sent via email or displayed in
                the app notifications. You can customize when and how you
                receive notifications in the settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cancellation Tab */}
        <TabsContent value="cancellation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Cancellation Instructions
              </CardTitle>
              <CardDescription>
                Follow these steps to cancel your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cancellationGuide ? (
                <div className="space-y-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{ __html: cancellationGuide }}
                    />
                  </div>

                  {subscription.cancellationUrl && (
                    <div className="mt-6">
                      <Button asChild>
                        <a
                          href={subscription.cancellationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Go to Cancellation Page
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <HelpCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No cancellation guide available
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                    We don't have specific cancellation instructions for this
                    service. Try visiting the service's website and looking for
                    account or subscription settings.
                  </p>

                  {subscription.cancellationUrl && (
                    <Button className="mt-6" asChild>
                      <a
                        href={subscription.cancellationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  )}

                  <div className="mt-8 w-full max-w-xl">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Cancellation Tip</AlertTitle>
                      <AlertDescription>
                        Many subscription services make cancellation difficult.
                        Try searching for "{subscription.name} how to cancel
                        subscription" or check their help center for
                        cancellation instructions.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                After Cancellation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                After cancelling your subscription, remember to:
              </p>
              <ul className="mt-2 space-y-2 text-sm list-disc list-inside text-muted-foreground">
                <li>Check your email for a cancellation confirmation</li>
                <li>Monitor your bank account to ensure no further charges</li>
                <li>Update the status of this subscription in TrialGuard</li>
                <li>
                  Consider removing any payment information from the service
                </li>
              </ul>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  Mark as cancelled in TrialGuard
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={subscription.status === "canceled"}
                >
                  {subscription.status === "canceled"
                    ? "Already Cancelled"
                    : "Mark as Cancelled"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
