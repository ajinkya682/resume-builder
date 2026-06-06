"use client";

import { useState, useCallback } from "react";
import { aiService } from "@/services/aiService";
import {
  generateSummary,
  generateSkills,
  generateProjectDescription,
  generateExperienceDescription,
  improveContent,
} from "@/types/ai.types";
import { ATSScoreResult } from "@/types/frontend.types";
import toast from "react-hot-toast";

/**
 * useAI — a generic AI hook that manages loading + error state
 * for any AI generation call. Each feature can use it independently.
 */
export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "AI generation failed";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateSummaryAI = useCallback(
    (body: generateSummary) => run(() => aiService.generateSummary(body)),
    [run],
  );

  const generateSkillsAI = useCallback(
    (body: generateSkills) => run(() => aiService.generateSkills(body)),
    [run],
  );

  const generateExperienceDescriptionAI = useCallback(
    (body: generateExperienceDescription) =>
      run(() => aiService.generateExperienceDescription(body)),
    [run],
  );

  const generateProjectDescriptionAI = useCallback(
    (body: generateProjectDescription) =>
      run(() => aiService.generateProjectDescription(body)),
    [run],
  );

  const improveContentAI = useCallback(
    (body: improveContent) => run(() => aiService.improveContent(body)),
    [run],
  );

  const getATSScore = useCallback(
    (resumeText: string) =>
      run<ATSScoreResult>(() => aiService.getATSScore(resumeText)),
    [run],
  );

  return {
    isGenerating,
    error,
    generateSummaryAI,
    generateSkillsAI,
    generateExperienceDescriptionAI,
    generateProjectDescriptionAI,
    improveContentAI,
    getATSScore,
  };
}
