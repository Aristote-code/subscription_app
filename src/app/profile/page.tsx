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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  Settings,
  User,
  CreditCard,
  Calendar,
  Bell,
  Clock,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/placeholder-avatar.jpg",
    joinDate: "2023-01-15",
    isPremium: true,
  };

  // Mock subscription stats
  const stats = {
    activeSubscriptions: 5,
    expiringSoon: 2,
    expired: 3,
    moneySaved: 255.99,
    averageTrialLength: 14.3,
    cancelledTrials: 8,
  };

  // Mock subscription activity
  const recentActivity = [
    {
      id: 1,
      type: "added",
      service: "Netflix",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      type: "expired",
      service: "Amazon Prime",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      type: "reminder",
      service: "Spotify",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      type: "cancelled",
      service: "Adobe Creative Cloud",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  // Activity icon mapping
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "added":
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case "expired":
        return <Calendar className="h-4 w-4 text-red-500" />;
      case "reminder":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  // Activity description mapping
  const getActivityDescription = (activity: (typeof recentActivity)[0]) => {
    switch (activity.type) {
      case "added":
        return `Added ${activity.service} subscription`;
      case "expired":
        return `${activity.service} trial expired`;
      case "reminder":
        return `Reminder for ${activity.service} trial`;
      case "cancelled":
        return `Cancelled ${activity.service} before trial ended`;
      default:
        return `Activity for ${activity.service}`;
    }
  };

  return (
    <div className="flex flex-col p-8">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold mr-2">{user.name}</h2>
                  {user.isPremium && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <BadgeCheck className="h-5 w-5 text-blue-500" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              Premium Member
                            </h4>
                            <p className="text-sm">
                              You have access to all premium features including
                              advanced analytics and unlimited subscriptions.
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {format(new Date(user.joinDate), "MMMM yyyy")}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                asChild
              >
                <a href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Stats</CardTitle>
            <CardDescription>
              Overview of your subscription management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Active Subscriptions
                </p>
                <p className="text-2xl font-bold">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {stats.expiringSoon}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-gray-500">
                  {stats.expired}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Money Saved</p>
                <p className="text-2xl font-bold text-green-500">
                  ${stats.moneySaved}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    Trials Cancelled
                  </span>
                  <span className="font-medium">{stats.cancelledTrials}</span>
                </div>
                <Progress
                  value={
                    (stats.cancelledTrials /
                      (stats.cancelledTrials + stats.expired)) *
                    100
                  }
                  className="h-2"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">
                    Cancellation Rate
                  </span>
                  <span>
                    {Math.round(
                      (stats.cancelledTrials /
                        (stats.cancelledTrials + stats.expired)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    Avg. Trial Length
                  </span>
                  <span className="font-medium">
                    {stats.averageTrialLength} days
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your subscription activity over the past month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(activity.date, "MMM d, yyyy")}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.type === "cancelled"
                        ? "Successfully cancelled before the trial period ended."
                        : activity.type === "reminder"
                        ? "You received a notification about this trial ending soon."
                        : activity.type === "expired"
                        ? "The trial period has ended. This subscription is now inactive."
                        : "You added this subscription to your tracking list."}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
