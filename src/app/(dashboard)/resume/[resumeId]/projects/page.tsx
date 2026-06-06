"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus, Trash2, ChevronLeft, ChevronRight, Wand2, ChevronDown, ChevronUp,
} from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAI } from "@/hooks/useAI";
import { IProjects } from "@/types/resume.types";

const emptyProject = (): IProjects => ({
  title: "",
  description: "",
  githubUrl: "",
  LiveUrl: "",
  techStack: [],
});

export default function ProjectsPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume, saveResume, isSaving } = useResumeContext();
  const router = useRouter();
  const { isGenerating, generateProjectDescriptionAI, improveContentAI } = useAI();

  const [projects, setProjects] = useState<IProjects[]>([emptyProject()]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [techInputs, setTechInputs] = useState<string[]>([""]);

  useEffect(() => {
    if (resume?.projects?.length) {
      setProjects(resume.projects);
      setTechInputs(resume.projects.map(() => ""));
    }
  }, [resume]);

  const updateProject = (idx: number, key: keyof IProjects, value: string | string[]) =>
    setProjects((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p)),
    );

  const addTechToProject = (idx: number, tech: string) => {
    const t = tech.trim();
    if (!t) return;
    const current = projects[idx].techStack ?? [];
    if (!current.includes(t)) {
      updateProject(idx, "techStack", [...current, t]);
    }
  };

  const removeTech = (projIdx: number, tech: string) => {
    updateProject(
      projIdx,
      "techStack",
      (projects[projIdx].techStack ?? []).filter((t) => t !== tech),
    );
  };

  const addProject = () => {
    setProjects((p) => [...p, emptyProject()]);
    setTechInputs((p) => [...p, ""]);
    setExpandedIndex(projects.length);
  };

  const removeProject = (idx: number) => {
    setProjects((p) => p.filter((_, i) => i !== idx));
    setTechInputs((p) => p.filter((_, i) => i !== idx));
    setExpandedIndex(Math.max(0, idx - 1));
  };

  const handleGenerateDesc = async (idx: number) => {
    const proj = projects[idx];
    const result = await generateProjectDescriptionAI({
      projectName: proj.title,
      technologies: proj.techStack ?? [],
      features: [proj.description || ""],
    });
    if (result) updateProject(idx, "description", result);
  };

  const handleImprove = async (idx: number) => {
    const desc = projects[idx].description;
    if (!desc) return;
    const result = await improveContentAI({ content: desc });
    if (result) updateProject(idx, "description", result);
  };

  const handleSaveAndNext = async () => {
    await saveResume({ projects: projects.filter((p) => p.title) });
    router.push(`/resume/${resumeId}/education`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Projects</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Showcase your best work. AI can describe your projects professionally.
        </p>
      </div>

      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <Card key={idx} padding="none">
            <button
              type="button"
              onClick={() => setExpandedIndex(expandedIndex === idx ? -1 : idx)}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {proj.title || `Project ${idx + 1}`}
                </p>
                {proj.techStack?.length > 0 && (
                  <p className="text-xs text-[var(--primary-light)] mt-0.5">
                    {proj.techStack.slice(0, 3).join(" · ")}
                    {proj.techStack.length > 3 ? ` +${proj.techStack.length - 3}` : ""}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {idx > 0 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeProject(idx); }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                )}
                {expandedIndex === idx ? <ChevronUp size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
              </div>
            </button>

            {expandedIndex === idx && (
              <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="sm:col-span-2">
                    <Input id={`proj-title-${idx}`} label="Project Name" placeholder="E-Commerce Platform"
                      value={proj.title} onChange={(e) => updateProject(idx, "title", e.target.value)} />
                  </div>
                  <Input id={`proj-github-${idx}`} label="GitHub URL" placeholder="github.com/user/repo"
                    value={proj.githubUrl} onChange={(e) => updateProject(idx, "githubUrl", e.target.value)} />
                  <Input id={`proj-live-${idx}`} label="Live URL" placeholder="https://myproject.com"
                    value={proj.LiveUrl} onChange={(e) => updateProject(idx, "LiveUrl", e.target.value)} />
                </div>

                {/* Tech Stack */}
                <div>
                  <Input
                    id={`proj-tech-${idx}`}
                    label="Tech Stack"
                    placeholder="Press Enter to add a technology"
                    value={techInputs[idx] ?? ""}
                    onChange={(e) =>
                      setTechInputs((p) =>
                        p.map((v, i) => (i === idx ? e.target.value : v)),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTechToProject(idx, techInputs[idx] ?? "");
                        setTechInputs((p) => p.map((v, i) => (i === idx ? "" : v)));
                      }
                    }}
                  />
                  {(proj.techStack?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.techStack.map((t) => (
                        <Badge key={t} variant="primary" onRemove={() => removeTech(idx, t)}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Description</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" isLoading={isGenerating}
                        leftIcon={<Wand2 size={13} />} onClick={() => handleGenerateDesc(idx)}
                        disabled={!proj.title}>
                        Generate
                      </Button>
                      {proj.description && (
                        <Button variant="ghost" size="sm" isLoading={isGenerating}
                          onClick={() => handleImprove(idx)}>
                          Improve
                        </Button>
                      )}
                    </div>
                  </div>
                  <Textarea id={`proj-desc-${idx}`}
                    placeholder="Describe the project, its purpose, and your contributions…"
                    value={proj.description}
                    onChange={(e) => updateProject(idx, "description", e.target.value)}
                    rows={5} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />} onClick={addProject}>
        Add Project
      </Button>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/experience`)}>
          Back
        </Button>
        <Button id="proj-next-btn" variant="primary" size="md" isLoading={isSaving}
          rightIcon={<ChevronRight size={16} />} onClick={handleSaveAndNext}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
