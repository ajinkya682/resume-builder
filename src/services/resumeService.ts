import api from "./api";
import { IResume } from "@/types/resume.types";
import { ResumeCardData } from "@/types/frontend.types";

export const resumeService = {
  async create(): Promise<IResume> {
    const res = await api.post("/resume/create");
    return res.data.data as IResume;
  },

  async list(): Promise<ResumeCardData[]> {
    const res = await api.get("/resume/list");
    return (res.data.data as { resumes: ResumeCardData[] }).resumes;
  },

  async getById(resumeId: string): Promise<IResume> {
    const res = await api.get(`/resume/${resumeId}`);
    return res.data.data as IResume;
  },

  async update(resumeId: string, body: Partial<IResume>): Promise<IResume> {
    const res = await api.patch(`/resume/${resumeId}`, body);
    return res.data.data as IResume;
  },

  async remove(resumeId: string): Promise<void> {
    await api.delete(`/resume/${resumeId}`);
  },
};
