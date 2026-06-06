"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,

  Globe,
  ChevronRight,
} from "lucide-react";
import { useResumeContext } from "@/app/(dashboard)/resume/[resumeId]/layout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IPersonalInfo } from "@/types/resume.types";

export default function PersonalInfoPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { resume, saveResume, isSaving } = useResumeContext();
  const router = useRouter();

  const [form, setForm] = useState<IPersonalInfo>({
    fullname: "",
    email: "",
    mobile: "",
    location: "",
    github: "",
    linkedin: "",
    portfolio: "",
  });

  // Sync from loaded resume
  useEffect(() => {
    if (resume?.personalInfo) {
      setForm({
        fullname: resume.personalInfo.fullname ?? "",
        email: resume.personalInfo.email ?? "",
        mobile: resume.personalInfo.mobile ?? "",
        location: resume.personalInfo.location ?? "",
        github: resume.personalInfo.github ?? "",
        linkedin: resume.personalInfo.linkedin ?? "",
        portfolio: resume.personalInfo.portfolio ?? "",
      });
    }
  }, [resume]);

  const field = (key: keyof IPersonalInfo) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSaveAndNext = async () => {
    const updates = {
      personalInfo: form,
      title: form.fullname || "Untitled Resume",
    };
    await saveResume(updates);
    router.push(`/resume/${resumeId}/summary`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Personal Information
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          This appears at the top of your resume. Make it accurate and
          professional.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            id="pi-fullname"
            label="Full Name"
            placeholder="John Doe"
            value={form.fullname}
            onChange={field("fullname")}
            leftIcon={<User size={15} />}
            required
          />
        </div>

        <Input
          id="pi-email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={field("email")}
          leftIcon={<Mail size={15} />}
          required
        />

        <Input
          id="pi-mobile"
          label="Mobile"
          type="tel"
          placeholder="10-digit number"
          value={form.mobile}
          onChange={field("mobile")}
          leftIcon={<Phone size={15} />}
        />

        <div className="sm:col-span-2">
          <Input
            id="pi-location"
            label="Location"
            placeholder="Mumbai, India"
            value={form.location}
            onChange={field("location")}
            leftIcon={<MapPin size={15} />}
          />
        </div>

        <Input
          id="pi-github"
          label="GitHub"
          placeholder="github.com/username"
          value={form.github}
          onChange={field("github")}
          leftIcon={"🐙"}
        />

        <Input
          id="pi-linkedin"
          label="LinkedIn"
          placeholder="linkedin.com/in/username"
          value={form.linkedin}
          onChange={field("linkedin")}
          leftIcon={"🔗"}
        />

        <div className="sm:col-span-2">
          <Input
            id="pi-portfolio"
            label="Portfolio Website"
            placeholder="https://yoursite.com"
            value={form.portfolio}
            onChange={field("portfolio")}
            leftIcon={<Globe size={15} />}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          id="pi-next-btn"
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
