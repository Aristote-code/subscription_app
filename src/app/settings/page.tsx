"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [remindDaysBefore, setRemindDaysBefore] = useState(3);

  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card className="bg-black border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription className="text-zinc-400">
              Manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue="Demo User"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="user@example.com"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveSettings}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border-none shadow-none"
            >
              Save Account Details
            </Button>
          </CardFooter>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-black border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription className="text-zinc-400">
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-zinc-400">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-zinc-700"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-zinc-400">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
                className="data-[state=checked]:bg-zinc-700"
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
                className="bg-zinc-900 border-zinc-800 text-white w-20"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveSettings}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border-none shadow-none"
            >
              Save Notification Settings
            </Button>
          </CardFooter>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-black border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription className="text-zinc-400">
              Customize the app appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-zinc-400">
                  Select your preferred theme
                </p>
              </div>
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-none shadow-none"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
