"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { FullPageSpinner } from "@/components/ui/Spinner";

/**
 * Dashboard layout wraps all authenticated pages.
 * It handles:
 * 1. Auth guard — redirect to /login if not authenticated
 * 2. Sidebar (desktop) + Navbar (mobile) shell
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <FullPageSpinner />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navbar */}
      <Navbar />

      {/* Main content — offset for sidebar on desktop */}
      <main className="md:ml-64 min-h-screen pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
