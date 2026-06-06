"use client";

import React from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  onRemove?: () => void;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-[var(--surface-4)] text-[var(--text-secondary)] border-[var(--border-light)]",
  primary:  "bg-[var(--primary-glow)] text-[var(--primary-xlight)] border-[var(--primary-border)]",
  success:  "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-border)]",
  warning:  "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-border)]",
  error:    "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error-border)]",
  info:     "bg-[var(--info-bg)] text-[var(--info)] border-[rgba(59,130,246,0.25)]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--text-muted)]",
  primary: "bg-[var(--primary-light)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  error:   "bg-[var(--error)]",
  info:    "bg-[var(--info)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  onRemove,
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium rounded-[var(--r-full)] border",
        "transition-all duration-[var(--duration)]",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors cursor-pointer text-[10px] leading-none shrink-0"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
