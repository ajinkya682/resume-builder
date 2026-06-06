"use client";

import React from "react";
import { IResume } from "@/types/resume.types";
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from "lucide-react";

interface ResumeTemplateProps {
  resume: IResume;
  className?: string;
}

/**
 * A4 professional resume template.
 * This component is intentionally styled with inline styles and explicit
 * pixel values to ensure it renders consistently for window.print() / PDF.
 * Tailwind classes would be stripped in print context without proper config.
 */
export function ResumeTemplate({ resume, className = "" }: ResumeTemplateProps) {
  const { personalInfo, summary, skills, workExperience, projects, education, certification } = resume;

  return (
    <div
      id="resume-template"
      className={`bg-white text-gray-900 font-sans ${className}`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "18mm 16mm",
        fontSize: "10pt",
        lineHeight: "1.5",
        fontFamily: "'Inter', 'Arial', sans-serif",
        color: "#1a1a2e",
      }}
    >
      {/* ── Header ── */}
      <div style={{ borderBottom: "2.5px solid #6366f1", paddingBottom: "12px", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24pt", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "2px", color: "#0f0f13" }}>
          {personalInfo?.fullname || "Your Name"}
        </h1>

        {/* Contact row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "6px" }}>
          {personalInfo?.email && (
            <ContactItem icon="✉" text={personalInfo.email} />
          )}
          {personalInfo?.mobile && (
            <ContactItem icon="☏" text={personalInfo.mobile} />
          )}
          {personalInfo?.location && (
            <ContactItem icon="⌖" text={personalInfo.location} />
          )}
          {personalInfo?.linkedin && (
            <ContactItem icon="in" text={personalInfo.linkedin} isLink />
          )}
          {personalInfo?.github && (
            <ContactItem icon="⊕" text={personalInfo.github} isLink />
          )}
          {personalInfo?.portfolio && (
            <ContactItem icon="↗" text={personalInfo.portfolio} isLink />
          )}
        </div>
      </div>

      {/* ── Summary ── */}
      {summary && (
        <Section title="Professional Summary">
          <p style={{ color: "#374151", lineHeight: "1.65" }}>{summary}</p>
        </Section>
      )}

      {/* ── Skills ── */}
      {skills && skills.length > 0 && (
        <Section title="Technical Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  padding: "2px 10px",
                  borderRadius: "999px",
                  fontSize: "8.5pt",
                  background: "#eef2ff",
                  color: "#4338ca",
                  border: "1px solid #c7d2fe",
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* ── Work Experience ── */}
      {workExperience && workExperience.length > 0 && (
        <Section title="Work Experience">
          {workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: i < workExperience.length - 1 ? "14px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "10.5pt" }}>{exp.position}</span>
                  {exp.company && (
                    <span style={{ color: "#6366f1", fontWeight: 500, marginLeft: "6px" }}>
                      @ {exp.company}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "8.5pt", color: "#6b7280", whiteSpace: "nowrap" }}>
                  {exp.startDate} — {exp.endDate || "Present"}
                </span>
              </div>
              {exp.description && (
                <p style={{ marginTop: "4px", color: "#374151", fontSize: "9.5pt", lineHeight: "1.6" }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Projects ── */}
      {projects && projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: i < projects.length - 1 ? "12px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "10.5pt" }}>{proj.title}</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  {proj.githubUrl && (
                    <span style={{ fontSize: "8pt", color: "#6366f1" }}>GitHub</span>
                  )}
                  {proj.LiveUrl && (
                    <span style={{ fontSize: "8pt", color: "#6366f1" }}>Live</span>
                  )}
                </div>
              </div>
              {proj.techStack?.length > 0 && (
                <p style={{ fontSize: "8.5pt", color: "#6366f1", marginTop: "2px", fontWeight: 500 }}>
                  {proj.techStack.join(" · ")}
                </p>
              )}
              {proj.description && (
                <p style={{ marginTop: "3px", color: "#374151", fontSize: "9.5pt", lineHeight: "1.55" }}>
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Education ── */}
      {education && education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: i < education.length - 1 ? "12px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "10.5pt" }}>{edu.degree}</span>
                  {edu.institute && (
                    <span style={{ color: "#6366f1", fontWeight: 500, marginLeft: "6px" }}>
                      @ {edu.institute}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "8.5pt", color: "#6b7280", whiteSpace: "nowrap" }}>
                  {edu.startDate} — {edu.endDate || "Present"}
                </span>
              </div>
              {edu.description && (
                <p style={{ marginTop: "4px", color: "#374151", fontSize: "9pt" }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Certifications ── */}
      {certification && certification.length > 0 && (
        <Section title="Certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {certification.map((cert, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "9.5pt" }}>
                <span style={{ color: "#6366f1", fontSize: "8pt" }}>✦</span>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ── Helper Components ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2
        style={{
          fontSize: "9pt",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#6366f1",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "4px",
          marginBottom: "10px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function ContactItem({ icon, text, isLink = false }: { icon: string; text: string; isLink?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "8.5pt", color: "#374151" }}>
      <span style={{ color: "#6366f1", fontSize: "9pt" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
