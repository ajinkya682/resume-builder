"use client";

import { useState, useCallback } from "react";
import { resumeService } from "@/services/resumeService";
import { IResume } from "@/types/resume.types";
import { ResumeCardData } from "@/types/frontend.types";
import toast from "react-hot-toast";

/**
 * useResume — manages a single resume's state.
 * This is used inside the resume builder layout.
 * The resume state is the single source of truth for all builder steps.
 */
export function useResume() {
  const [resume, setResume] = useState<IResume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchResume = useCallback(async (resumeId: string) => {
    setIsLoading(true);
    try {
      const data = await resumeService.getById(resumeId);
      setResume(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load resume";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateResume = useCallback(
    async (resumeId: string, updates: Partial<IResume>) => {
      setIsSaving(true);
      try {
        const updated = await resumeService.update(resumeId, updates);
        setResume(updated);
        toast.success("Saved successfully");
        return updated;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save";
        toast.error(msg);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  return { resume, setResume, isLoading, isSaving, fetchResume, updateResume };
}

/**
 * useResumeList — manages the dashboard resume list
 */
export function useResumeList() {
  const [resumes, setResumes] = useState<ResumeCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await resumeService.list();
      setResumes(data);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createResume = useCallback(async (): Promise<string | null> => {
    try {
      const newResume = await resumeService.create();
      toast.success("New resume created!");
      return newResume._id as string;
    } catch {
      toast.error("Failed to create resume");
      return null;
    }
  }, []);

  const deleteResume = useCallback(async (resumeId: string) => {
    try {
      await resumeService.remove(resumeId);
      setResumes((prev) => prev.filter((r) => r._id !== resumeId));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  }, []);

  return { resumes, isLoading, fetchResumes, createResume, deleteResume };
}
