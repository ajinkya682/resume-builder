"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, X, Plus, ChevronLeft, ChevronRight, Wand2 } from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAI } from "@/hooks/useAI";
import { EXPERIENCE_LEVELS } from "@/types/frontend.types";

export default function SkillsPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume, saveResume, isSaving } = useResumeContext();
  const router = useRouter();
  const { isGenerating, generateSkillsAI } = useAI();

  const [skills, setSkills] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);

  useEffect(() => {
    if (resume?.skills) setSkills(resume.skills);
  }, [resume]);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((p) => [...p, trimmed]);
    }
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputVal);
      setInputVal("");
    }
  };

  const removeSkill = (skill: string) =>
    setSkills((p) => p.filter((s) => s !== skill));

  const handleGenerate = async () => {
    if (!jobTitle) return;
    const result = await generateSkillsAI({ jobTitle, expressionLevel: experienceLevel });
    if (result && Array.isArray(result)) {
      // Merge with existing, deduplicate
      setSkills((prev) => {
        const merged = [...new Set([...prev, ...result])];
        return merged;
      });
    }
  };

  const handleSaveAndNext = async () => {
    await saveResume({ skills });
    router.push(`/resume/${resumeId}/experience`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Technical Skills
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Add your skills manually or let AI suggest the best ones for your role.
        </p>
      </div>

      {/* AI Generator */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary-glow)] border border-[var(--primary)]/20 flex items-center justify-center">
            <Sparkles size={14} className="text-[var(--primary-light)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            AI Skill Suggester
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Input
            id="sk-job-title"
            label="Job Title"
            placeholder="e.g. Backend Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Experience Level
            </label>
            <select
              id="sk-exp-level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as typeof experienceLevel)}
              className="h-10 rounded-[10px] px-3 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
            >
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <Button
          id="sk-generate-btn"
          variant="primary"
          size="sm"
          isLoading={isGenerating}
          leftIcon={<Wand2 size={15} />}
          onClick={handleGenerate}
          disabled={!jobTitle}
        >
          {isGenerating ? "Generating…" : "Suggest Skills with AI"}
        </Button>
      </Card>

      {/* Manual Add */}
      <div>
        <Input
          id="sk-add-input"
          label="Add Skills"
          placeholder="Type a skill and press Enter or comma"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleInputKey}
          rightIcon={
            <button
              type="button"
              onClick={() => { addSkill(inputVal); setInputVal(""); }}
              className="text-[var(--primary-light)] hover:text-[var(--primary)] cursor-pointer"
            >
              <Plus size={16} />
            </button>
          }
        />
      </div>

      {/* Skill Tags */}
      {skills.length > 0 ? (
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-2.5 font-medium uppercase tracking-wider">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} added
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="primary" onRemove={() => removeSkill(skill)}>
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-[var(--border)] rounded-[12px] text-[var(--text-muted)]">
          <p className="text-sm">No skills added yet.</p>
          <p className="text-xs mt-1">Add manually or use AI to suggest skills.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="md"
          leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/summary`)}
        >
          Back
        </Button>
        <Button
          id="sk-next-btn"
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
