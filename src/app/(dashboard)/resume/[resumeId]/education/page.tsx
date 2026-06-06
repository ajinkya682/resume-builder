"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IEducation } from "@/types/resume.types";

const emptyEdu = (): IEducation => ({
  institute: "",
  degree: "",
  startDate: "",
  endDate: "",
  description: "",
});

export default function EducationPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume, saveResume, isSaving } = useResumeContext();
  const router = useRouter();
  const [education, setEducation] = useState<IEducation[]>([emptyEdu()]);

  useEffect(() => {
    if (resume?.education?.length) setEducation(resume.education);
  }, [resume]);

  const updateEdu = (idx: number, key: keyof IEducation, value: string) =>
    setEducation((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, [key]: value } : e)),
    );

  const addEdu = () => setEducation((p) => [...p, emptyEdu()]);

  const removeEdu = (idx: number) =>
    setEducation((p) => p.filter((_, i) => i !== idx));

  const handleSaveAndNext = async () => {
    await saveResume({ education: education.filter((e) => e.degree || e.institute) });
    router.push(`/resume/${resumeId}/certifications`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Education</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          List your academic background from most recent to oldest.
        </p>
      </div>

      <div className="space-y-4">
        {education.map((edu, idx) => (
          <Card key={idx} padding="md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--surface-3)] flex items-center justify-center">
                  <GraduationCap size={14} className="text-[var(--primary-light)]" />
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {edu.degree || `Education ${idx + 1}`}
                </span>
              </div>
              {idx > 0 && (
                <button onClick={() => removeEdu(idx)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Input id={`edu-degree-${idx}`} label="Degree / Qualification"
                  placeholder="B.Tech in Computer Science" value={edu.degree}
                  onChange={(e) => updateEdu(idx, "degree", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Input id={`edu-inst-${idx}`} label="Institute / University"
                  placeholder="MIT, IIT Bombay" value={edu.institute}
                  onChange={(e) => updateEdu(idx, "institute", e.target.value)} />
              </div>
              <Input id={`edu-start-${idx}`} label="Start Year" placeholder="2019"
                value={edu.startDate} onChange={(e) => updateEdu(idx, "startDate", e.target.value)} />
              <Input id={`edu-end-${idx}`} label="End Year" placeholder="2023"
                value={edu.endDate} onChange={(e) => updateEdu(idx, "endDate", e.target.value)} />
              <div className="sm:col-span-2">
                <Textarea id={`edu-desc-${idx}`} label="Additional Notes (optional)"
                  placeholder="GPA, honors, relevant coursework…" value={edu.description ?? ""}
                  onChange={(e) => updateEdu(idx, "description", e.target.value)} rows={2} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />} onClick={addEdu}>
        Add Education
      </Button>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/projects`)}>
          Back
        </Button>
        <Button id="edu-next-btn" variant="primary" size="md" isLoading={isSaving}
          rightIcon={<ChevronRight size={16} />} onClick={handleSaveAndNext}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
