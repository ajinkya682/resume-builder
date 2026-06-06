"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Sparkles } from "lucide-react";
import { useResumeList } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";
import { ResumeCard } from "@/components/resume/ResumeCard";
import { Button } from "@/components/ui/Button";
import { ResumeCardSkeleton } from "@/components/ui/SkeletonLoader";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { resumes, isLoading, fetchResumes, createResume, deleteResume } =
    useResumeList();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    const id = await createResume();
    if (id) router.push(`/resume/${id}/personal`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            My Resumes
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Welcome back, <span className="text-[var(--primary-light)] font-medium">{user?.name}</span>. Build something great today.
          </p>
        </div>
        <Button
          id="create-resume-btn"
          variant="primary"
          size="md"
          leftIcon={<Plus size={18} />}
          onClick={handleCreate}
        >
          New Resume
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <ResumeCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && resumes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 fade-in">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
              <FileText size={40} className="text-[var(--text-muted)]" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow-primary)]">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              No resumes yet
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs">
              Create your first AI-powered resume and get it ATS-optimized in minutes.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus size={18} />}
            onClick={handleCreate}
          >
            Create My First Resume
          </Button>
        </div>
      )}

      {/* Resume Grid */}
      {!isLoading && resumes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onDelete={deleteResume}
            />
          ))}

          {/* Create New Card */}
          <button
            onClick={handleCreate}
            className="flex flex-col items-center justify-center gap-3 bg-transparent border-2 border-dashed border-[var(--border)] rounded-[14px] p-8 min-h-[160px] text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:text-[var(--primary-light)] hover:bg-[var(--primary-glow)] transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Plus size={20} />
            </div>
            <span className="text-sm font-medium">New Resume</span>
          </button>
        </div>
      )}
    </div>
  );
}
