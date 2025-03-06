"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function NotificationSettingsPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailType, setTestEmailType] = useState("trialEnding");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [reminderDays, setReminderDays] = useState("5");

  // Fetch user's subscriptions when component mounts
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        const data = await response.json();
        if (data.success && data.data) {
          setSubscriptions(data.data);
          if (data.data.length > 0) {
            setSubscriptionId(data.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSaveSettings = async () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleTestEmail = async () => {
    if (!subscriptionId) {
      toast({
        title: "No subscription selected",
        description: "Please select a subscription to test with.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/notifications/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: testEmailType,
          subscriptionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Test email sent",
          description: `A test email of type "${testEmailType}" has been sent to your email address.`,
        });
      } else {
        toast({
          title: "Failed to send test email",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Breadcrumbs
        customSegments={[
          { name: "Settings", href: "/settings" },
          { name: "Notifications", href: "/settings/notifications" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Preferences</CardTitle>
            <CardDescription>
              Configure how and when you receive email notifications about your
              subscriptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trial-reminders">Trial End Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified before free trials end
                </p>
              </div>
              <Select
                value={reminderDays}
                onValueChange={setReminderDays}
                disabled={!emailEnabled}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="2">2 days before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="5">5 days before</SelectItem>
                  <SelectItem value="7">7 days before</SelectItem>
                  <SelectItem value="14">14 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Preferences</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Push Notification Settings</CardTitle>
            <CardDescription>
              Configure browser push notifications (experimental)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your browser
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushEnabled}
                onCheckedChange={setPushEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Email Notifications</CardTitle>
            <CardDescription>
              Send a test email to verify your notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-email-type">Notification Type</Label>
                <Select value={testEmailType} onValueChange={setTestEmailType}>
                  <SelectTrigger id="test-email-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trialEnding">Trial Ending</SelectItem>
                    <SelectItem value="paymentDue">Payment Due</SelectItem>
                    <SelectItem value="subscriptionCancelled">
                      Subscription Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="test-subscription">Subscription</Label>
                <Select
                  value={subscriptionId}
                  onValueChange={setSubscriptionId}
                  disabled={subscriptions.length === 0}
                >
                  <SelectTrigger id="test-subscription">
                    <SelectValue
                      placeholder={
                        subscriptions.length === 0
                          ? "No subscriptions available"
                          : "Select subscription"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {subscriptions.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    You need to add a subscription first
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleTestEmail}
              disabled={isLoading || subscriptions.length === 0}
            >
              {isLoading ? "Sending..." : "Send Test Email"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
