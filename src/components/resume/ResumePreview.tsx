"use client";

import React from "react";
import { IResume } from "@/types/resume.types";
import { ResumeTemplate } from "./ResumeTemplate";
import { FileText } from "lucide-react";

interface ResumePreviewProps {
  resume: IResume | null;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
          <FileText size={28} className="text-[var(--text-muted)]" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Your resume preview will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Scale wrapper — A4 is 210mm. We scale it to fit in the panel. */}
      <div
        className="origin-top"
        style={{
          transform: "scale(0.65)",
          transformOrigin: "top center",
          width: "210mm",
          marginBottom: "-120mm", // compensate for scale shrink
        }}
      >
        <div className="shadow-2xl rounded-sm overflow-hidden">
          <ResumeTemplate resume={resume} />
        </div>
      </div>
    </div>
  );
}
