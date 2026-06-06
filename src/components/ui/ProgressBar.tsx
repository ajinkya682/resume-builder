"use client";

import React from "react";

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showValue?: boolean;
  color?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const colorMap = {
  primary: "bg-[var(--primary)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  error: "bg-[var(--error)]",
};

const heightMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

function getScoreColor(value: number): "error" | "warning" | "success" | "primary" {
  if (value < 40) return "error";
  if (value < 65) return "warning";
  if (value < 80) return "primary";
  return "success";
}

export function ProgressBar({
  value,
  label,
  showValue = false,
  color,
  size = "md",
  animated = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const resolvedColor = color ?? getScoreColor(clampedValue);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-[var(--surface-3)] overflow-hidden ${heightMap[size]}`}
      >
        <div
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${clampedValue}%` }}
          className={[
            "h-full rounded-full transition-all duration-700 ease-out",
            colorMap[resolvedColor],
            animated ? "animate-pulse" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
