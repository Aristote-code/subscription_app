"use client";

import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";
import { OnboardingProvider, OnboardingModal } from "@/components/onboarding";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Header />
        <main className="flex-1 p-4 overflow-auto">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
      <OnboardingModal />
    </OnboardingProvider>
  );
}
