"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Check, Save } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function SettingsPage() {
  // User profile settings
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState("3");
  const [dailyDigest, setDailyDigest] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  // Display settings
  const [defaultSort, setDefaultSort] = useState("endDate");
  const [defaultView, setDefaultView] = useState("table");
  const [showExpired, setShowExpired] = useState(true);

  // Handle save profile
  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully", {
      description: "Your profile information has been updated.",
    });
  };

  // Handle save notifications
  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved", {
      description: "Your notification settings have been updated.",
    });
  };

  // Handle save display settings
  const handleSaveDisplay = () => {
    toast.success("Display preferences saved", {
      description: "Your display settings have been updated.",
    });
  };

  return (
    <div className="flex flex-col p-8">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your TrialGuard experience
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <Button className="mt-4" onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label htmlFor="reminder-days">
                  Default Reminder (days before expiration)
                </Label>
                <Select
                  value={reminderDaysBefore}
                  onValueChange={setReminderDaysBefore}
                  disabled={!emailNotifications}
                >
                  <SelectTrigger id="reminder-days" className="w-full">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">2 days</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-digest" className="text-base">
                    Daily Digest
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get a summary of your subscriptions each day
                  </p>
                </div>
                <Switch
                  id="daily-digest"
                  checked={dailyDigest}
                  onCheckedChange={setDailyDigest}
                  disabled={!emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-report" className="text-base">
                    Weekly Report
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your subscription status
                  </p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                  disabled={!emailNotifications}
                />
              </div>

              <Button onClick={handleSaveNotifications}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how your subscriptions are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="default-sort">Default Sort Order</Label>
                <Select value={defaultSort} onValueChange={setDefaultSort}>
                  <SelectTrigger id="default-sort" className="w-full">
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serviceName">Service Name</SelectItem>
                    <SelectItem value="endDate">End Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="dateAdded">Date Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label htmlFor="default-view">Default View</Label>
                <Select value={defaultView} onValueChange={setDefaultView}>
                  <SelectTrigger id="default-view" className="w-full">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table View</SelectItem>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="calendar">Calendar View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-expired" className="text-base">
                    Show Expired Subscriptions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display subscriptions that have already expired
                  </p>
                </div>
                <Switch
                  id="show-expired"
                  checked={showExpired}
                  onCheckedChange={setShowExpired}
                />
              </div>

              <Button onClick={handleSaveDisplay}>
                <Save className="mr-2 h-4 w-4" />
                Save Display Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of TrialGuard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">Color Theme</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Switch between light and dark mode
                </p>
                <div className="flex items-center space-x-2">
                  <ModeToggle />
                </div>
              </div>

              <Separator />

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-4">
                  More customization options coming soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
