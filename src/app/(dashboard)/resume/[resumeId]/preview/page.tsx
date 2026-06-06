"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Download, Eye } from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function PreviewPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume } = useResumeContext();
  const router = useRouter();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Resume Preview
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            This is exactly how your resume will look when downloaded.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download size={15} />}
            onClick={() => router.push(`/resume/${resumeId}/download`)}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Full-size preview */}
      <div className="overflow-x-auto rounded-[12px] border border-[var(--border)] bg-gray-100 p-4">
        <div className="flex justify-center">
          {resume ? (
            <div className="shadow-2xl">
              <ResumeTemplate resume={resume} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <Spinner size="lg" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/ats`)}>
          Back
        </Button>
        <Button id="preview-next-btn" variant="primary" size="md"
          leftIcon={<Download size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/download`)}>
          Download PDF
        </Button>
      </div>
    </div>
  );
}
