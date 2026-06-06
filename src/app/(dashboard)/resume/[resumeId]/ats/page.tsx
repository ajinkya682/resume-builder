"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  BarChart2, CheckCircle2, AlertCircle, Lightbulb,
  ChevronLeft, ChevronRight, Sparkles, RefreshCw,
} from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { useAI } from "@/hooks/useAI";
import { ATSScoreResult } from "@/types/frontend.types";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IResume } from "@/types/resume.types";

/** Serialise the resume into plain text for the ATS prompt */
function resumeToText(resume: IResume): string {
  const lines: string[] = [];

  if (resume.personalInfo?.fullname) lines.push(resume.personalInfo.fullname);
  if (resume.personalInfo?.email) lines.push(resume.personalInfo.email);
  if (resume.summary) lines.push(`\nSUMMARY\n${resume.summary}`);

  if (resume.skills?.length)
    lines.push(`\nSKILLS\n${resume.skills.join(", ")}`);

  if (resume.workExperience?.length) {
    lines.push("\nEXPERIENCE");
    resume.workExperience.forEach((e) => {
      lines.push(`${e.position} at ${e.company} (${e.startDate} – ${e.endDate})`);
      if (e.description) lines.push(e.description);
    });
  }

  if (resume.projects?.length) {
    lines.push("\nPROJECTS");
    resume.projects.forEach((p) => {
      lines.push(`${p.title}: ${p.description}`);
      if (p.techStack?.length) lines.push(p.techStack.join(", "));
    });
  }

  if (resume.education?.length) {
    lines.push("\nEDUCATION");
    resume.education.forEach((e) =>
      lines.push(`${e.degree} — ${e.institute} (${e.startDate}–${e.endDate})`),
    );
  }

  if (resume.certification?.length)
    lines.push(`\nCERTIFICATIONS\n${resume.certification.join("\n")}`);

  return lines.join("\n");
}

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 80 ? "#10b981" : score >= 65 ? "#6366f1" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 40 ? "Fair" : "Needs Work";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, var(--surface-3) 0deg)`,
          padding: "4px",
        }}
      >
        <div className="w-full h-full rounded-full bg-[var(--surface)] flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-[var(--text-muted)]">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

export default function ATSPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume } = useResumeContext();
  const router = useRouter();
  const { isGenerating, getATSScore } = useAI();
  const [atsResult, setAtsResult] = useState<ATSScoreResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (!resume) return;
    const text = resumeToText(resume);
    const result = await getATSScore(text);
    if (result) {
      setAtsResult(result);
      setHasAnalyzed(true);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          ATS Score Analysis
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Analyze your resume against ATS (Applicant Tracking System) criteria.
        </p>
      </div>

      {/* Trigger */}
      <Card padding="md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-glow)] border border-[var(--primary)]/20 flex items-center justify-center">
            <BarChart2 size={20} className="text-[var(--primary-light)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              AI Resume Analyzer
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Powered by Gemini AI — evaluates 10 criteria
            </p>
          </div>
        </div>
        <Button
          id="ats-analyze-btn"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isGenerating}
          leftIcon={hasAnalyzed ? <RefreshCw size={16} /> : <Sparkles size={16} />}
          onClick={handleAnalyze}
        >
          {isGenerating
            ? "Analyzing Resume…"
            : hasAnalyzed
            ? "Re-Analyze Resume"
            : "Analyze My Resume"}
        </Button>
      </Card>

      {/* Results */}
      {atsResult && (
        <div className="space-y-4 fade-in">
          {/* Score */}
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreCircle score={atsResult.score} />
              <div className="flex-1 w-full space-y-3">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  Overall ATS Score
                </h3>
                <ProgressBar value={atsResult.score} showValue size="lg" />
                <p className="text-sm text-[var(--text-secondary)]">
                  {atsResult.score >= 80
                    ? "Your resume is well-optimized for ATS systems."
                    : atsResult.score >= 65
                    ? "Good score — a few improvements can push it higher."
                    : atsResult.score >= 40
                    ? "Your resume needs optimization to pass ATS filters."
                    : "Significant improvements needed for ATS compatibility."}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            {atsResult.strengths?.length > 0 && (
              <Card padding="md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[var(--success)]" />
                    <CardTitle>Strengths</CardTitle>
                  </div>
                </CardHeader>
                <ul className="space-y-2">
                  {atsResult.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--success)] mt-0.5 shrink-0">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Weaknesses */}
            {atsResult.weaknesses?.length > 0 && (
              <Card padding="md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} className="text-[var(--warning)]" />
                    <CardTitle>Weaknesses</CardTitle>
                  </div>
                </CardHeader>
                <ul className="space-y-2">
                  {atsResult.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--warning)] mt-0.5 shrink-0">⚠</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Suggestions */}
          {atsResult.suggestions?.length > 0 && (
            <Card padding="md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-[var(--primary-light)]" />
                  <CardTitle>Improvement Suggestions</CardTitle>
                </div>
              </CardHeader>
              <div className="space-y-2.5">
                {atsResult.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-[8px] bg-[var(--surface-2)]">
                    <span className="text-xs font-bold text-[var(--primary-light)] bg-[var(--primary-glow)] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-[var(--text-secondary)]">{s}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/certifications`)}>
          Back
        </Button>
        <Button id="ats-next-btn" variant="primary" size="md"
          rightIcon={<ChevronRight size={16} />}
          onClick={() => router.push(`/resume/${resumeId}/preview`)}>
          Preview Resume
        </Button>
      </div>
    </div>
  );
}
