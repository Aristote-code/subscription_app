"use client";

import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";
import { OnboardingProvider, OnboardingModal } from "@/components/onboarding";
import Sidebar from "@/components/sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <OnboardingProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 pl-0 md:pl-64 pt-14">
          <Header />
          <main className="flex-1 p-4 overflow-auto">
            <div className="mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
      <OnboardingModal />
    </OnboardingProvider>
  );
}
