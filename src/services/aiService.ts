import api from "./api";
import {
  generateSummary,
  generateSkills,
  generateProjectDescription,
  generateExperienceDescription,
  improveContent,
} from "@/types/ai.types";
import { ATSScoreResult } from "@/types/frontend.types";

/**
 * Architecture Note on ATS Score:
 * The backend returns `data.ATSScore` as a JSON STRING (not an object).
 * We must JSON.parse() it here to return a typed ATSScoreResult.
 * This normalization belongs in the service layer, not the UI.
 */
export const aiService = {
  async generateSummary(body: generateSummary): Promise<string> {
    const res = await api.post("/ai/generate-summary", body);
    return (res.data.data as { summary: string }).summary ?? "";
  },

  async generateSkills(body: generateSkills): Promise<string[]> {
    const res = await api.post("/ai/generate-skills", body);
    return (res.data.data as { skills: string[] }).skills ?? [];
  },

  async generateExperienceDescription(
    body: generateExperienceDescription,
  ): Promise<string> {
    const res = await api.post("/ai/generate-experience-description", body);
    return (res.data.data as { summary: string }).summary ?? "";
  },

  async generateProjectDescription(
    body: generateProjectDescription,
  ): Promise<string> {
    const res = await api.post("/ai/generate-project-discription", body);
    return (res.data.data as { summary: string }).summary ?? "";
  },

  async improveContent(body: improveContent): Promise<string> {
    const res = await api.post("/ai/improve-content", body);
    return (res.data.data as { ImprovedContent: string }).ImprovedContent ?? "";
  },

  async getATSScore(resumeText: string): Promise<ATSScoreResult> {
    const res = await api.post("/ai/ats-score", { resumeText });
    const raw = (res.data.data as { ATSScore: string }).ATSScore;
    // The backend returns a JSON string — we parse it here in the service layer
    const cleaned = raw
      ? raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      : "{}";
    return JSON.parse(cleaned) as ATSScoreResult;
  },
};
