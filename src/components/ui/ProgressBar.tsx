"use client";

import React from "react";

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showValue?: boolean;
  color?: "primary" | "success" | "warning" | "error";
  size?: "xs" | "sm" | "md";
  animated?: boolean;
  className?: string;
}

function resolveColor(value: number): "error" | "warning" | "primary" | "success" {
  if (value < 40) return "error";
  if (value < 65) return "warning";
  if (value < 80) return "primary";
  return "success";
}

const colorMap = {
  primary: { bar: "bg-[var(--primary)]", glow: "rgba(124,58,237,0.5)", text: "var(--primary-light)" },
  success: { bar: "bg-[var(--success)]", glow: "rgba(16,185,129,0.5)", text: "var(--success)" },
  warning: { bar: "bg-[var(--warning)]", glow: "rgba(245,158,11,0.5)", text: "var(--warning)" },
  error:   { bar: "bg-[var(--error)]",   glow: "rgba(244,63,94,0.5)",  text: "var(--error)"   },
};

const heightMap = { xs: "h-1", sm: "h-1.5", md: "h-2" };

export function ProgressBar({
  value,
  label,
  showValue = false,
  color,
  size = "sm",
  animated = false,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const resolved = color ?? resolveColor(clamped);
  const { bar, glow, text } = colorMap[resolved];

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-xs text-[var(--text-secondary)]">{label}</span>
          )}
          {showValue && (
            <span
              className="text-xs font-bold tabular-nums"
              style={{ color: text }}
            >
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${heightMap[size]} rounded-full bg-[var(--surface-4)] overflow-hidden`}
      >
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            width: `${clamped}%`,
            boxShadow: clamped > 5 ? `0 0 8px 0 ${glow}` : "none",
          }}
          className={[
            "h-full rounded-full transition-all duration-700 ease-[var(--ease)]",
            bar,
            animated ? "animate-pulse" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
