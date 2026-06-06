"use client";

import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-[var(--r-md)] px-3 py-2.5 text-sm",
            "bg-[var(--surface-2)] text-[var(--text-primary)]",
            "placeholder:text-[var(--text-disabled)]",
            "transition-all duration-[var(--duration)] ease-[var(--ease)]",
            "resize-y min-h-[96px] focus:outline-none",
            hasError
              ? "border border-[var(--error-border)] shadow-[0_0_0_3px_var(--error-bg)] focus:border-[var(--error)]"
              : "border border-[var(--border-light)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)]",
            className,
          ].join(" ")}
          {...props}
        />
        {hasError && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1.5">
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
Textarea.displayName = "Textarea";
