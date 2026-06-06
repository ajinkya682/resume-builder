"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-[var(--shadow-primary)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.4)] border border-[var(--primary-dark)]",
  secondary:
    "bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-primary)] border border-[var(--border)]",
  ghost:
    "bg-transparent hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border)]",
  danger:
    "bg-[var(--error-bg)] hover:bg-[var(--error)] text-[var(--error)] hover:text-white border border-[var(--error)] hover:border-[var(--error)]",
  outline:
    "bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-glow)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-[8px]",
  md: "h-10 px-4 text-sm gap-2 rounded-[10px]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[12px]",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        "active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        "cursor-pointer select-none whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={size === "sm" ? 14 : size === "lg" ? 18 : 16} className="animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
