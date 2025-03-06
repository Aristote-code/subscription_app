"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  ArrowLeft,
  CheckCircle,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/breadcrumbs";

/**
 * Interface for notification data
 */
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/**
 * Notifications page to view and manage notifications
 */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      // Set empty array to allow the app to function even with an error
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mark notification as read
   */
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  /**
   * Delete a notification
   */
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Remove from local state
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  /**
   * Get icon based on notification type
   */
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  /**
   * Format date to readable string
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container max-w-4xl py-8">
      <Breadcrumbs />
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              View and manage your notifications
            </p>
          </div>
          {notifications.length > 0 && !notifications.every((n) => n.read) && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Bell className="mx-auto mb-2 h-10 w-10 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${
                notification.read ? "bg-gray-50" : "bg-white border-primary/30"
              } transition-colors`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                        {!notification.read && (
                          <Badge className="ml-2 bg-primary" variant="default">
                            New
                          </Badge>
                        )}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <div className="mt-3 flex justify-end gap-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="outline"
                          size="sm"
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteNotification(notification.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
