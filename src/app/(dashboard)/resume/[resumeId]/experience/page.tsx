"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus, Trash2, ChevronLeft, ChevronRight, Sparkles, Wand2, ChevronDown, ChevronUp,
} from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAI } from "@/hooks/useAI";
import { IWorkExperience } from "@/types/resume.types";
import { EXPERIENCE_LEVELS } from "@/types/frontend.types";

const emptyExp = (): IWorkExperience => ({
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
});

export default function ExperiencePage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume, saveResume, isSaving } = useResumeContext();
  const router = useRouter();
  const { isGenerating, generateExperienceDescriptionAI, improveContentAI } = useAI();

  const [experiences, setExperiences] = useState<IWorkExperience[]>([emptyExp()]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [aiState, setAiState] = useState({ jobRole: "", experienceLevel: EXPERIENCE_LEVELS[0], yearsOfExperience: 1, techStack: "" });

  useEffect(() => {
    if (resume?.workExperience?.length) {
      setExperiences(resume.workExperience);
    }
  }, [resume]);

  const updateExp = (idx: number, key: keyof IWorkExperience, value: string) =>
    setExperiences((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, [key]: value } : e)),
    );

  const addExp = () => {
    setExperiences((p) => [...p, emptyExp()]);
    setExpandedIndex(experiences.length);
  };

  const removeExp = (idx: number) => {
    setExperiences((p) => p.filter((_, i) => i !== idx));
    setExpandedIndex(Math.max(0, idx - 1));
  };

  const handleGenerateDesc = async (idx: number) => {
    const exp = experiences[idx];
    const result = await generateExperienceDescriptionAI({
      jobRole: aiState.jobRole || exp.position,
      experienceLevel: aiState.experienceLevel,
      yearsOfExperience: aiState.yearsOfExperience,
      techStack: aiState.techStack
        ? aiState.techStack.split(",").map((s) => s.trim())
        : [],
    });
    if (result) updateExp(idx, "description", result);
  };

  const handleImprove = async (idx: number) => {
    const desc = experiences[idx].description;
    if (!desc) return;
    const result = await improveContentAI({ content: desc });
    if (result) updateExp(idx, "description", result);
  };

  const handleSaveAndNext = async () => {
    await saveResume({ workExperience: experiences.filter((e) => e.company || e.position) });
    router.push(`/resume/${resumeId}/projects`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Work Experience
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Add your work history. AI can generate compelling descriptions.
        </p>
      </div>

      {/* AI Config Card */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[var(--primary-light)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">AI Description Config</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input id="exp-job-role" label="Job Role" placeholder="e.g. Software Engineer" value={aiState.jobRole}
            onChange={(e) => setAiState((p) => ({ ...p, jobRole: e.target.value }))} />
          <Input id="exp-years" label="Years of Experience" type="number" placeholder="2" value={String(aiState.yearsOfExperience)}
            onChange={(e) => setAiState((p) => ({ ...p, yearsOfExperience: Number(e.target.value) }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Level</label>
            <select id="exp-level" value={aiState.experienceLevel}
              onChange={(e) => setAiState((p) => ({ ...p, experienceLevel: e.target.value as typeof aiState.experienceLevel }))}
              className="h-10 rounded-[10px] px-3 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
            >
              {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <Input id="exp-tech" label="Tech Stack (comma-separated)" placeholder="React, Node.js, PostgreSQL" value={aiState.techStack}
            onChange={(e) => setAiState((p) => ({ ...p, techStack: e.target.value }))} />
        </div>
      </Card>

      {/* Experience Entries */}
      <div className="space-y-3">
        {experiences.map((exp, idx) => (
          <Card key={idx} padding="none">
            <button
              type="button"
              onClick={() => setExpandedIndex(expandedIndex === idx ? -1 : idx)}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {exp.position || `Experience ${idx + 1}`}
                </p>
                {exp.company && (
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    @ {exp.company}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeExp(idx); }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                {expandedIndex === idx ? <ChevronUp size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
              </div>
            </button>

            {expandedIndex === idx && (
              <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <Input id={`exp-pos-${idx}`} label="Job Title / Position" placeholder="Software Engineer" value={exp.position}
                    onChange={(e) => updateExp(idx, "position", e.target.value)} />
                  <Input id={`exp-company-${idx}`} label="Company" placeholder="Acme Corp" value={exp.company}
                    onChange={(e) => updateExp(idx, "company", e.target.value)} />
                  <Input id={`exp-start-${idx}`} label="Start Date" placeholder="Jan 2022" value={exp.startDate}
                    onChange={(e) => updateExp(idx, "startDate", e.target.value)} />
                  <Input id={`exp-end-${idx}`} label="End Date" placeholder="Present" value={exp.endDate}
                    onChange={(e) => updateExp(idx, "endDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Description</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" isLoading={isGenerating} leftIcon={<Wand2 size={13} />}
                        onClick={() => handleGenerateDesc(idx)}>
                        Generate
                      </Button>
                      {exp.description && (
                        <Button variant="ghost" size="sm" isLoading={isGenerating}
                          onClick={() => handleImprove(idx)}>
                          Improve
                        </Button>
                      )}
                    </div>
                  </div>
                  <Textarea id={`exp-desc-${idx}`} placeholder="Describe your responsibilities and achievements…"
                    value={exp.description} onChange={(e) => updateExp(idx, "description", e.target.value)} rows={5} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />} onClick={addExp}>
        Add Experience
      </Button>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/skills`)}>
          Back
        </Button>
        <Button id="exp-next-btn" variant="primary" size="md" isLoading={isSaving}
          rightIcon={<ChevronRight size={16} />} onClick={handleSaveAndNext}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
