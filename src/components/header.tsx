"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMenu from "@/components/user-menu";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Update search term from URL when component mounts
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Debounce search to avoid too many URL updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pathname === "/dashboard") {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
          params.set("q", searchTerm);
        } else {
          params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <header className="border-b border-zinc-800 bg-black">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search subscriptions..."
              className="w-full pl-8 pr-4 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            asChild
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none shadow-none"
          >
            <Link href="/add-subscription">
              <Plus className="mr-2 h-4 w-4" />
              Add new subscription
            </Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
