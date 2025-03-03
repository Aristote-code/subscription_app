"use client";

import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

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
      <div
        className={`fixed left-0 top-0 bottom-0 z-40 h-full bg-black border-r border-zinc-800 flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* User profile section */}
        <div className="p-4 border-b border-zinc-800 flex items-center">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          {isExpanded && (
            <div className="ml-3">
              <h3 className="text-sm font-medium text-white">Account</h3>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 -right-3 h-6 w-6 rounded-full bg-black border border-zinc-800 text-white hover:bg-zinc-800 z-10"
          onClick={toggleSidebar}
        >
          <ChevronRightIcon
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Navigation links */}
        <nav className="flex-1 pt-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center p-3 mx-2 rounded-md ${
                  pathname === "/dashboard"
                    ? "bg-zinc-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <HomeIcon className="h-5 w-5 min-w-5" />
                {isExpanded && <span className="ml-3">Home</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/support"
                className={`flex items-center p-3 mx-2 rounded-md ${
                  pathname === "/dashboard/support"
                    ? "bg-zinc-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <LifeBuoyIcon className="h-5 w-5 min-w-5" />
                {isExpanded && <span className="ml-3">Contact Support</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom links */}
        <div className="p-4 border-t border-zinc-800">
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className={`w-full justify-start text-gray-400 hover:text-white hover:bg-zinc-800 ${
                  !isExpanded && "px-3"
                }`}
                onClick={() => setIsShareDialogOpen(true)}
              >
                <Share2Icon className="h-5 w-5 min-w-5" />
                {isExpanded && <span className="ml-3">Invite People</span>}
              </Button>
            </li>
            <li>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`flex items-center p-3 mx-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800`}
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5 min-w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5 min-w-5" />
                )}
                {isExpanded && (
                  <span className="ml-3">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Share/Invite Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="bg-black text-white border border-zinc-800 sm:max-w-md">
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
    </>
  );
}
