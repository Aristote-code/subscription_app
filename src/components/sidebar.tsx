"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  LifeBuoyIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  ChevronRightIcon,
  Share2Icon,
  BarChart,
  Bell,
  Calendar,
  CreditCard,
  HelpCircle,
  Menu,
  Package,
  Settings,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UserMenu from "./user-menu";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: Package,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Reminders",
    href: "/reminders",
    icon: Bell,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Add this useEffect to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR hydration issues
  if (!mounted) {
    return null;
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const sendEmail = (email: string) => {
    window.open(
      `mailto:${email}?subject=Join%20TrialGuard&body=I%20recommend%20using%20TrialGuard%20to%20track%20your%20subscriptions.%20Join%20me%20at%20https://trialguard.com/invite`
    );
    setIsShareDialogOpen(false);
  };

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=I%20recommend%20using%20TrialGuard%20to%20track%20your%20subscriptions.%20Join%20me%20at%20https://trialguard.com/invite`
    );
    setIsShareDialogOpen(false);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div
        className={`fixed left-0 top-0 bottom-0 z-40 h-full bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <span className="ml-2 font-bold text-lg">TrialGuard</span>
          </div>

          {/* Close button (mobile only) */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 -right-3 h-6 w-6 rounded-full bg-background border border-border text-foreground hover:bg-secondary z-10 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex flex-col flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}

          <Link
            href="/dashboard/support"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
              pathname === "/dashboard/support"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            onClick={() => setIsOpen(false)}
          >
            <HelpCircle className="h-4 w-4" />
            Support
          </Link>

          <Link
            href="/settings"
            className={`w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary ${
              pathname === "/settings" ? "bg-secondary text-foreground" : ""
            } flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all`}
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>

        <div className="p-4 border-t border-border">
          <UserMenu />
        </div>
      </div>

      {/* Share/Invite Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Invite People to TrialGuard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="invite-link" className="text-sm font-medium">
                Share this link
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="invite-link"
                  value="https://trialguard.com/invite"
                  readOnly
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
                <Button
                  onClick={() =>
                    copyToClipboard("https://trialguard.com/invite")
                  }
                  variant="outline"
                  className="whitespace-nowrap border-zinc-800 hover:bg-zinc-800 text-white"
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Send via email
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
                <Button
                  onClick={() => sendEmail("friend@example.com")}
                  variant="outline"
                  className="whitespace-nowrap border-zinc-800 hover:bg-zinc-800 text-white"
                >
                  Send
                </Button>
              </div>
            </div>

            <Button
              onClick={shareViaWhatsApp}
              variant="outline"
              className="w-full border-zinc-800 hover:bg-zinc-800 text-white"
            >
              Share via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogTrigger asChild>
          <Button
            className={`flex items-center p-3 mx-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary`}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            <span>Help</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Help & Resources</DialogTitle>
            <DialogDescription>
              Find help and support for using TrialGuard
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              asChild
              variant="outline"
              className="whitespace-nowrap border-border hover:bg-secondary text-foreground"
            >
              <Link href="/dashboard/support">Support Center</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="whitespace-nowrap border-border hover:bg-secondary text-foreground"
            >
              <a
                href="https://docs.trialguard.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
            <Button
              variant="default"
              className="w-full border-border hover:bg-secondary text-foreground"
              onClick={() => setShowHelp(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
