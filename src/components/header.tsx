"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import ThemeToggle from "@/components/theme-toggle";
import NotificationPopover from "@/components/notification-popover";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-foreground">TrialGuard</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <NotificationPopover />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
