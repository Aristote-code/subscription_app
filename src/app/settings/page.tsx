"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tag, ChevronRight, Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [remindDaysBefore, setRemindDaysBefore] = useState(3);
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card className="bg-background border-border text-foreground">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue="Demo User"
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="user@example.com"
                className="bg-background border-input text-foreground"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveSettings}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Account Details
            </Button>
          </CardFooter>
        </Card>

        {/* Categories Management */}
        <Card className="bg-background border-border text-foreground">
          <CardHeader>
            <CardTitle>Categories Management</CardTitle>
            <CardDescription>
              Organize your subscriptions with custom categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-2 rounded-md">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    Create, edit, and organize subscription categories
                  </p>
                </div>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/settings/categories">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-background border-border text-foreground">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remind-days">
                Remind me days before trial ends
              </Label>
              <Input
                id="remind-days"
                type="number"
                value={remindDaysBefore}
                onChange={(e) => setRemindDaysBefore(parseInt(e.target.value))}
                min={1}
                max={14}
                className="bg-background border-input text-foreground w-20"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveSettings}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Notification Settings
            </Button>
          </CardFooter>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-background border-border text-foreground">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the app appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme
                </p>
              </div>
              <Button
                onClick={() =>
                  setTheme(currentTheme === "dark" ? "light" : "dark")
                }
                variant="outline"
                className="flex gap-2 items-center"
              >
                {currentTheme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
