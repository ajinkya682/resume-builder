export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthAction =
  | { type: "SET_USER"; payload: AuthUser }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

// ─── Resume Builder Steps ──────────────────────────────────────────────────────

export interface ResumeStep {
  id: number;
  label: string;
  slug: string;
  icon: string;
}

export const RESUME_STEPS: ResumeStep[] = [
  { id: 1, label: "Personal Info", slug: "personal", icon: "User" },
  { id: 2, label: "Summary", slug: "summary", icon: "FileText" },
  { id: 3, label: "Skills", slug: "skills", icon: "Zap" },
  { id: 4, label: "Experience", slug: "experience", icon: "Briefcase" },
  { id: 5, label: "Projects", slug: "projects", icon: "Code2" },
  { id: 6, label: "Education", slug: "education", icon: "GraduationCap" },
  { id: 7, label: "Certifications", slug: "certifications", icon: "Award" },
  { id: 8, label: "ATS Analysis", slug: "ats", icon: "BarChart2" },
  { id: 9, label: "Preview", slug: "preview", icon: "Eye" },
  { id: 10, label: "Download", slug: "download", icon: "Download" },
];

// ─── ATS Score ────────────────────────────────────────────────────────────────

export interface ATSScoreResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

// ─── Resume Card (dashboard) ──────────────────────────────────────────────────

export interface ResumeCardData {
  _id: string;
  title: string;
  personalInfo: {
    fullname?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Experience Level ─────────────────────────────────────────────────────────

export type ExperienceLevel =
  | "Entry Level"
  | "Mid Level"
  | "Senior Level"
  | "Lead/Principal Level";

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead/Principal Level",
];
