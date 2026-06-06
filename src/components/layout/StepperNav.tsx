"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { RESUME_STEPS } from "@/types/frontend.types";

export function StepperNav() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const pathname = usePathname();

  // Determine current step from pathname
  const currentStepSlug = pathname.split("/").pop();
  const currentStepIndex = RESUME_STEPS.findIndex(
    (s) => s.slug === currentStepSlug,
  );

  return (
    <div className="w-full">
      {/* Desktop: horizontal stepper */}
      <div className="hidden lg:flex items-center w-full overflow-x-auto pb-1">
        {RESUME_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;
          const href = `/resume/${resumeId}/${step.slug}`;

          return (
            <React.Fragment key={step.id}>
              <Link
                href={href}
                className={[
                  "flex items-center gap-2 shrink-0 transition-all duration-200 group",
                  "hover:opacity-100",
                  isUpcoming ? "opacity-40" : "opacity-100",
                ].join(" ")}
              >
                {/* Circle */}
                <div
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                    "border-2 transition-all duration-300 shrink-0",
                    isCompleted
                      ? "bg-[var(--success)] border-[var(--success)] text-white"
                      : isCurrent
                      ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-[var(--shadow-primary)]"
                      : "bg-transparent border-[var(--border)] text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  {isCompleted ? <Check size={13} strokeWidth={3} /> : step.id}
                </div>
                {/* Label */}
                <span
                  className={[
                    "text-xs font-medium whitespace-nowrap",
                    isCurrent
                      ? "text-[var(--text-primary)]"
                      : isCompleted
                      ? "text-[var(--success)]"
                      : "text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </Link>

              {/* Connector line */}
              {index < RESUME_STEPS.length - 1 && (
                <div
                  className={[
                    "flex-1 h-px mx-2 transition-colors duration-300 min-w-[16px]",
                    index < currentStepIndex
                      ? "bg-[var(--success)]"
                      : "bg-[var(--border)]",
                  ].join(" ")}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: compact step indicator */}
      <div className="lg:hidden flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStepIndex >= 0 && (
            <>
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-sm font-bold text-white">
                {currentStepIndex + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {RESUME_STEPS[currentStepIndex]?.label}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Step {currentStepIndex + 1} of {RESUME_STEPS.length}
                </p>
              </div>
            </>
          )}
        </div>
        {/* Mini dots */}
        <div className="flex gap-1">
          {RESUME_STEPS.map((_, i) => (
            <div
              key={i}
              className={[
                "w-1.5 h-1.5 rounded-full transition-all",
                i < currentStepIndex
                  ? "bg-[var(--success)]"
                  : i === currentStepIndex
                  ? "bg-[var(--primary)] w-3"
                  : "bg-[var(--border)]",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
