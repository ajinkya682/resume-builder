"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StepperNav } from "@/components/layout/StepperNav";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { useResume } from "@/hooks/useResume";
import { IResume } from "@/types/resume.types";
import { FullPageSpinner } from "@/components/ui/Spinner";

// ─── Resume Builder Context ───────────────────────────────────────────────────
interface ResumeContextValue {
  resume: IResume | null;
  isSaving: boolean;
  saveResume: (updates: Partial<IResume>) => Promise<void>;
  setResume: React.Dispatch<React.SetStateAction<IResume | null>>;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function useResumeContext() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResumeContext must be within ResumeBuilderLayout");
  return ctx;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resumeId } = useParams<{ resumeId: string }>();
  const router = useRouter();
  const { resume, setResume, isLoading, isSaving, fetchResume, updateResume } =
    useResume();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (resumeId) fetchResume(resumeId);
  }, [resumeId, fetchResume]);

  const saveResume = async (updates: Partial<IResume>) => {
    if (!resumeId) return;
    await updateResume(resumeId, updates);
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <ResumeContext.Provider value={{ resume, isSaving, saveResume, setResume }}>
      <div className="min-h-screen flex flex-col">
        {/* ── Top Bar with Stepper ── */}
        <div className="sticky top-0 md:top-0 z-20 bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--border)] px-4 lg:px-8 py-3">
          <div className="max-w-full flex items-center gap-6">
            {/* Resume title */}
            <div className="shrink-0 hidden lg:block">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                Editing
              </p>
              <h2 className="text-sm font-semibold text-[var(--text-primary)] max-w-[180px] truncate">
                {resume?.personalInfo?.fullname || resume?.title || "New Resume"}
              </h2>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-[var(--border)] shrink-0" />

            {/* Stepper */}
            <div className="flex-1 overflow-hidden">
              <StepperNav />
            </div>

            {/* Preview toggle (mobile) */}
            <button
              onClick={() => setShowPreview((p) => !p)}
              className="lg:hidden shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {showPreview ? "← Form" : "Preview"}
            </button>
          </div>
        </div>

        {/* ── Main Area ── */}
        <div className="flex flex-1">
          {/* Form Panel */}
          <div
            className={`flex-1 overflow-y-auto ${showPreview ? "hidden lg:block" : "block"}`}
          >
            <div className="max-w-2xl mx-auto p-6 lg:p-8">{children}</div>
          </div>

          {/* Preview Panel — desktop always visible, mobile toggleable */}
          <div
            className={`${
              showPreview ? "flex" : "hidden"
            } lg:flex w-full lg:w-[420px] xl:w-[480px] bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto sticky top-[57px] max-h-[calc(100vh-57px)] shrink-0`}
          >
            <div className="w-full p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Live Preview
                </p>
                {isSaving && (
                  <span className="text-xs text-[var(--primary-light)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                    Saving…
                  </span>
                )}
              </div>
              <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-white">
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResumeContext.Provider>
  );
}
