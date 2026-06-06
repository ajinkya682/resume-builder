"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, RefreshCw, ChevronLeft, ChevronRight, Wand2 } from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAI } from "@/hooks/useAI";
import { EXPERIENCE_LEVELS } from "@/types/frontend.types";

export default function SummaryPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume, saveResume, isSaving } = useResumeContext();
  const router = useRouter();
  const { isGenerating, generateSummaryAI, improveContentAI } = useAI();

  const [summary, setSummary] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);
  const [skills, setSkills] = useState("");

  useEffect(() => {
    if (resume) {
      setSummary(resume.summary ?? "");
      setSkills((resume.skills ?? []).join(", "));
    }
  }, [resume]);

  const handleGenerate = async () => {
    if (!jobTitle) return;
    const result = await generateSummaryAI({
      jobTitle,
      expressionLevel: experienceLevel,
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
    });
    if (result) setSummary(result);
  };

  const handleImprove = async () => {
    if (!summary) return;
    const result = await improveContentAI({ content: summary });
    if (result) setSummary(result);
  };

  const handleSaveAndNext = async () => {
    await saveResume({ summary });
    router.push(`/resume/${resumeId}/skills`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Professional Summary
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          A compelling summary helps recruiters instantly understand your value.
        </p>
      </div>

      {/* AI Generator Card */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary-glow)] border border-[var(--primary)]/20 flex items-center justify-center">
            <Sparkles size={14} className="text-[var(--primary-light)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            AI Summary Generator
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Input
            id="sum-job-title"
            label="Job Title"
            placeholder="e.g. Full Stack Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Experience Level
            </label>
            <select
              id="sum-exp-level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as typeof experienceLevel)}
              className="h-10 rounded-[10px] px-3 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
            >
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Input
              id="sum-skills"
              label="Key Skills (comma-separated)"
              placeholder="React, Node.js, TypeScript, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>

        <Button
          id="sum-generate-btn"
          variant="primary"
          size="sm"
          isLoading={isGenerating}
          leftIcon={<Wand2 size={15} />}
          onClick={handleGenerate}
          disabled={!jobTitle}
        >
          {isGenerating ? "Generating…" : "Generate with AI"}
        </Button>
      </Card>

      {/* Summary Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Summary
          </span>
          {summary && (
            <Button
              id="sum-improve-btn"
              variant="ghost"
              size="sm"
              isLoading={isGenerating}
              leftIcon={<RefreshCw size={13} />}
              onClick={handleImprove}
            >
              Improve with AI
            </Button>
          )}
        </div>
        <Textarea
          id="sum-textarea"
          placeholder="Write your professional summary here, or use the AI generator above…"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={6}
          hint={`${summary.split(" ").filter(Boolean).length} words`}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="md"
          leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/personal`)}
        >
          Back
        </Button>
        <Button
          id="sum-next-btn"
          variant="primary"
          size="md"
          isLoading={isSaving}
          rightIcon={<ChevronRight size={16} />}
          onClick={handleSaveAndNext}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
