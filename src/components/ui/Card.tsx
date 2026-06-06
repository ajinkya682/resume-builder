"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingMap = {
  none: "",
  sm:   "p-4",
  md:   "p-5",
  lg:   "p-6",
};

export function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  padding = "md",
  onClick,
}: CardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={[
        "relative",
        "bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)]",
        "border border-[var(--border)]",
        "rounded-[var(--r-xl)]",
        "shadow-[var(--shadow-xs),inset_0_1px_0_rgba(255,255,255,0.04)]",
        "transition-all duration-[var(--duration)] ease-[var(--ease)]",
        hover || onClick
          ? "hover:border-[var(--border-light)] hover:shadow-[var(--shadow-sm),inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-px"
          : "",
        glow ? "hover:shadow-[var(--shadow-primary),inset_0_1px_0_rgba(255,255,255,0.06)]" : "",
        onClick ? "cursor-pointer w-full text-left" : "",
        paddingMap[padding],
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-sm font-semibold text-[var(--text-primary)] tracking-[-0.01em] ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs text-[var(--text-muted)] leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

/* Divider for use inside cards */
export function CardDivider() {
  return <div className="border-t border-[var(--border)] -mx-5 my-4" />;
}
