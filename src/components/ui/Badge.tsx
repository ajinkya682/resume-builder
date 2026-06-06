"use client";

import React from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-[var(--surface-3)] text-[var(--text-secondary)] border-[var(--border)]",
  primary:  "bg-[var(--primary-glow)] text-[var(--primary-light)] border-[var(--primary)]",
  success:  "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]",
  warning:  "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]",
  error:    "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]",
  info:     "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]",
};

export function Badge({
  children,
  variant = "default",
  onRemove,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1",
        "text-xs font-medium rounded-full border",
        "transition-colors duration-150",
        variantStyles[variant],
        className,
      ].join(" ")}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer leading-none"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
