"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Download, CheckCircle2, Printer, ChevronLeft, LayoutDashboard } from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";

export default function DownloadPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume } = useResumeContext();
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);

    // Inject print styles targeting only the resume template
    const style = document.createElement("style");
    style.id = "__resume-print-style";
    style.textContent = `
      @media print {
        body > *:not(#__resume-print-root) { display: none !important; }
        #__resume-print-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
          background: white;
        }
      }
    `;
    document.head.appendChild(style);

    // Create a hidden container with the resume
    const container = document.createElement("div");
    container.id = "__resume-print-root";
    container.style.display = "none";
    document.body.appendChild(container);

    // Use the already-rendered template from the DOM if present
    const existingTemplate = document.getElementById("resume-template");
    if (existingTemplate) {
      container.appendChild(existingTemplate.cloneNode(true));
    }

    container.style.display = "block";
    window.print();

    setTimeout(() => {
      document.head.removeChild(style);
      document.body.removeChild(container);
      setDownloading(false);
    }, 1000);
  };

  const steps = [
    "Click the Download PDF button below",
    'In the print dialog, set Destination to "Save as PDF"',
    "Set paper size to A4 and margins to None or Minimum",
    'Click "Save" to download your resume',
  ];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Download Your Resume
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Save your professionally formatted resume as a PDF.
        </p>
      </div>

      {/* Download Card */}
      <Card padding="lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary-glow)] border border-[var(--primary)]/20 flex items-center justify-center mx-auto">
            <Download size={28} className="text-[var(--primary-light)]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {resume?.personalInfo?.fullname
                ? `${resume.personalInfo.fullname}'s Resume`
                : "Your Resume"}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Ready to download as a professional PDF
            </p>
          </div>
          <Button
            id="download-pdf-btn"
            variant="primary"
            size="lg"
            isLoading={downloading}
            leftIcon={<Printer size={18} />}
            onClick={handleDownload}
          >
            {downloading ? "Opening Print Dialog…" : "Download PDF"}
          </Button>
        </div>
      </Card>

      {/* Instructions */}
      <Card padding="md">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          How to save as PDF
        </h4>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--primary-glow)] border border-[var(--primary)]/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[var(--primary-light)]">
                  {i + 1}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Success Checklist */}
      <Card padding="md">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Resume checklist
        </h4>
        {[
          { label: "Personal information complete", done: !!(resume?.personalInfo?.fullname && resume?.personalInfo?.email) },
          { label: "Professional summary added", done: !!(resume?.summary) },
          { label: "Skills section populated", done: !!(resume?.skills?.length) },
          { label: "At least one project added", done: !!(resume?.projects?.length) },
          { label: "Education history included", done: !!(resume?.education?.length) },
        ].map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2.5 py-2 border-b border-[var(--border)] last:border-0">
            <CheckCircle2
              size={16}
              className={done ? "text-[var(--success)]" : "text-[var(--border)]"}
            />
            <span className={`text-sm ${done ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
              {label}
            </span>
          </div>
        ))}
      </Card>

      {/* Hidden template for print */}
      {resume && (
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <ResumeTemplate resume={resume} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/preview`)}>
          Back
        </Button>
        <Button variant="secondary" size="md"
          leftIcon={<LayoutDashboard size={16} />}
          onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
