"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "subtle";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: [
    "relative overflow-hidden",
    "bg-[var(--primary)] text-white font-semibold",
    "border border-[var(--primary-dark)]",
    "shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,var(--shadow-primary)]",
    "hover:bg-[var(--primary-dark)]",
    "hover:shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,var(--shadow-primary-lg)]",
    "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
  ].join(" "),
  secondary: [
    "bg-[var(--surface-3)] text-[var(--text-primary)] font-medium",
    "border border-[var(--border-light)]",
    "shadow-[var(--shadow-xs)]",
    "hover:bg-[var(--surface-4)] hover:border-[var(--border-strong)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--text-secondary)] font-medium",
    "border border-transparent",
    "hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] hover:border-[var(--border)]",
  ].join(" "),
  subtle: [
    "bg-[var(--primary-glow)] text-[var(--primary-light)] font-medium",
    "border border-[var(--primary-border)]",
    "hover:bg-[rgba(124,58,237,0.25)] hover:border-[var(--primary)]",
  ].join(" "),
  danger: [
    "bg-[var(--error-bg)] text-[var(--error)] font-medium",
    "border border-[var(--error-border)]",
    "hover:bg-[var(--error)] hover:text-white hover:border-[var(--error)]",
  ].join(" "),
  outline: [
    "bg-transparent text-[var(--primary-light)] font-medium",
    "border border-[var(--primary-border)]",
    "hover:bg-[var(--primary-glow)] hover:border-[var(--primary)]",
  ].join(" "),
};

const sizeStyles: Record<Size, string> = {
  xs: "h-7  px-2.5 text-[11px] gap-1   rounded-[var(--r-sm)]",
  sm: "h-8  px-3   text-xs     gap-1.5 rounded-[var(--r)]",
  md: "h-9  px-4   text-sm     gap-2   rounded-[var(--r-md)]",
  lg: "h-11 px-5   text-sm     gap-2.5 rounded-[var(--r-lg)]",
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
  const iconSize =
    size === "xs" ? 12
    : size === "sm" ? 13
    : size === "lg" ? 16
    : 14;

  return (
    <button
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center",
        "transition-all duration-[var(--duration)] ease-[var(--ease)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        "active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        "cursor-pointer select-none whitespace-nowrap tracking-[-0.01em]",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={iconSize} className="animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}
