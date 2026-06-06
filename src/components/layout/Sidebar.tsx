"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  LogOut,
  LayoutDashboard,
  User,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[var(--surface)] border-r border-[var(--border)] fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow-primary)]">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-bold text-[var(--text-primary)] text-lg tracking-tight">
            Resume<span className="text-[var(--primary-light)]">AI</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium",
                "transition-all duration-200 group",
                isActive
                  ? "bg-[var(--primary-glow)] text-[var(--primary-light)] border border-[var(--primary)]/30"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              <Icon size={18} className="shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* AI Badge */}
        <div className="mt-4 p-3 rounded-[10px] bg-[var(--primary-glow)] border border-[var(--primary)]/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-[var(--primary-light)]" />
            <span className="text-xs font-semibold text-[var(--primary-light)]">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Gemini AI helps you craft the perfect resume.
          </p>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[var(--surface-2)] mb-2">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--error-bg)] hover:text-[var(--error)] transition-all duration-200 cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
