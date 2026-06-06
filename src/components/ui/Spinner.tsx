"use client";

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { outer: 16, inner: 12, stroke: 2 },
  md: { outer: 24, inner: 18, stroke: 2.5 },
  lg: { outer: 40, inner: 30, stroke: 3 },
};

/* Custom SVG spinner — much more elegant than Loader2 rotation */
export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const { outer, stroke } = sizeMap[size];

  return (
    <svg
      width={outer}
      height={outer}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className}`}
      style={{ animationDuration: "0.65s", animationTimingFunction: "linear" }}
      aria-label="Loading"
    >
      {/* Track */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeOpacity="0.15"
      />
      {/* Arc */}
      <path
        d="M12 3 a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg)] z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent)",
              animationDuration: "1.5s",
            }}
          />
          <Spinner size="lg" className="text-[var(--primary)]" />
        </div>
        <p className="text-xs text-[var(--text-muted)] tracking-wide animate-pulse">
          Loading…
        </p>
      </div>
    </div>
  );
}

/* Inline dot-style loading indicator */
export function DotsLoader() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-[var(--primary-light)]"
          style={{
            animation: "pulse-soft 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}
