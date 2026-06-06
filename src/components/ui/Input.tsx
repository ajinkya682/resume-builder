"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase"
            style={{ letterSpacing: "0.05em" }}
          >
            {label}
            {props.required && (
              <span className="text-[var(--primary-light)] ml-1 normal-case tracking-normal">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center group">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--text-muted)] flex items-center pointer-events-none z-10 group-focus-within:text-[var(--primary-light)] transition-colors duration-[var(--duration)]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full h-10 rounded-[var(--r-md)] text-sm",
              "bg-[var(--surface-2)] text-[var(--text-primary)]",
              "placeholder:text-[var(--text-disabled)]",
              "transition-all duration-[var(--duration)] ease-[var(--ease)]",
              "focus:outline-none",
              // Ring layers: border color + glow
              hasError
                ? "border border-[var(--error-border)] shadow-[0_0_0_3px_var(--error-bg)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]"
                : "border border-[var(--border-light)] shadow-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)]",
              leftIcon  ? "pl-9"  : "px-3",
              rightIcon ? "pr-9"  : "",
              className,
            ].join(" ")}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 flex items-center z-10">
              {rightIcon}
            </span>
          )}
        </div>
        {hasError && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1.5 fade-in">
            <span className="w-1 h-1 rounded-full bg-[var(--error)] inline-block shrink-0" />
            {error}
          </p>
        )}
        {hint && !hasError && (
          <p className="text-xs text-[var(--text-muted)]">{hint}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
