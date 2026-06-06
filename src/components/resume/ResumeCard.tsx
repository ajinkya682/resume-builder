"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Calendar, ArrowRight, User } from "lucide-react";
import { ResumeCardData } from "@/types/frontend.types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ResumeCardProps {
  resume: ResumeCardData;
  onDelete: (id: string) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName =
    resume.personalInfo?.fullname ||
    resume.title ||
    "Untitled Resume";

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(resume._id);
    setIsDeleting(false);
    setShowDelete(false);
  };

  return (
    <>
      <div className="group bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-light)] hover:shadow-[var(--shadow)] transition-all duration-200 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-[10px] bg-[var(--primary-glow)] border border-[var(--primary)]/20 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-[var(--primary-light)]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">
                {displayName}
              </h3>
              {resume.personalInfo?.email && (
                <p className="text-xs text-[var(--text-muted)] truncate flex items-center gap-1 mt-0.5">
                  <User size={11} />
                  {resume.personalInfo.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowDelete(true)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all duration-200 cursor-pointer shrink-0"
            aria-label="Delete resume"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Calendar size={12} />
          <span>Updated {formatDate(resume.updatedAt)}</span>
        </div>

        {/* Action */}
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          rightIcon={<ArrowRight size={14} />}
          onClick={() => router.push(`/resume/${resume._id}/personal`)}
        >
          Continue Editing
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Resume"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to delete{" "}
            <strong className="text-[var(--text-primary)]">{displayName}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              fullWidth
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
