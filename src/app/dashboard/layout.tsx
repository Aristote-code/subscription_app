"use client";

import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-16">
        <Header />
        <main className="flex-1 p-4 overflow-auto">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
