"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);

  // In a real app, you would fetch these from an API
  const notifications = [
    {
      id: 1,
      title: "Welcome to TrialGuard",
      message: "Start by adding your first subscription.",
      read: false,
      date: new Date().toISOString(),
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {notifications.some((n) => !n.read) && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border px-4 py-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
        </div>
        {notifications.length > 0 ? (
          <div className="max-h-[300px] overflow-auto">
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-1 border-b border-border p-4 last:border-0 ${
                    !notification.read ? "bg-secondary/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{notification.title}</h5>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
