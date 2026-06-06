"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <FileText size={14} className="text-white" />
          </div>
          <span className="font-bold text-[var(--text-primary)] tracking-tight">
            Resume<span className="text-[var(--primary-light)]">AI</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-2 fade-in">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-[10px] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <div className="border-t border-[var(--border)] pt-3 mt-1">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user?.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
            </div>
            <button
              onClick={() => { setMenuOpen(false); logout(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-sm font-medium text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
