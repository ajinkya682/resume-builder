"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, X, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function CertificationsPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume, saveResume, isSaving } = useResumeContext();
  const router = useRouter();

  const [certifications, setCertifications] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    if (resume?.certification) setCertifications(resume.certification);
  }, [resume]);

  const addCert = () => {
    const t = inputVal.trim();
    if (t && !certifications.includes(t)) {
      setCertifications((p) => [...p, t]);
      setInputVal("");
    }
  };

  const removeCert = (cert: string) =>
    setCertifications((p) => p.filter((c) => c !== cert));

  const handleSaveAndNext = async () => {
    await saveResume({ certification: certifications });
    router.push(`/resume/${resumeId}/ats`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Certifications
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Add professional certifications, licenses, or online course completions.
        </p>
      </div>

      <div>
        <Input
          id="cert-input"
          label="Add Certification"
          placeholder="e.g. AWS Certified Solutions Architect"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCert(); } }}
          rightIcon={
            <button type="button" onClick={addCert}
              className="text-[var(--primary-light)] hover:text-[var(--primary)] cursor-pointer">
              <Plus size={16} />
            </button>
          }
        />
      </div>

      {certifications.length > 0 ? (
        <div className="space-y-2">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--surface-2)] border border-[var(--border)] group"
            >
              <div className="flex items-center gap-2.5">
                <Award size={15} className="text-[var(--primary-light)] shrink-0" />
                <span className="text-sm text-[var(--text-primary)]">{cert}</span>
              </div>
              <button
                onClick={() => removeCert(cert)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--text-muted)] hover:text-[var(--error)] transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-[var(--border)] rounded-[12px]">
          <Award size={32} className="mx-auto text-[var(--text-muted)] mb-2" />
          <p className="text-sm text-[var(--text-muted)]">No certifications added.</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            This section is optional — skip if not applicable.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/education`)}>
          Back
        </Button>
        <Button id="cert-next-btn" variant="primary" size="md" isLoading={isSaving}
          rightIcon={<ChevronRight size={16} />} onClick={handleSaveAndNext}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
