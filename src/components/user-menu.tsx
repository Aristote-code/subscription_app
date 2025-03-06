"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  UserCog,
  CreditCard,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";

export default function UserMenu() {
  const router = useRouter();

  // This would come from your authentication context
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    image: "/placeholder-user.jpg",
  };

  const handleLogout = async () => {
    // Implement your logout logic here
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-4">
      <ModeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-secondary text-foreground">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-background border border-border text-foreground"
          align="end"
          forceMount
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary focus:bg-secondary">
              <User className="mr-2 h-4 w-4" />
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary focus:bg-secondary">
              <Settings className="mr-2 h-4 w-4" />
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary focus:bg-secondary">
              <CreditCard className="mr-2 h-4 w-4" />
              <Link href="/billing">Billing</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer bg-background text-foreground hover:bg-secondary focus:bg-secondary"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
