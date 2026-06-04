import { IResume } from "@/types/resume.types";
import mongoose from "mongoose";

const resumeShema = new mongoose.Schema<IResume>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "",
      required: true,
    },
    personalInfo: {
      fullname: String,
      email: String,
      mobile: String,
      location: String,
      github: String,
      linkedin: String,
      portfolio: String,
      default: {},
    },
    summary: {
      type: String,
      default: "",
      required: true,
    },
    workExperience: {
      type: [
        {
          company: String,
          position: String,
          startDate: String,
          endDate: String,
          description: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          githubUrl: String,
          LiveUrl: String,
          techStack: [String],
        },
      ],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: [
        {
          institute: String,
          degree: String,
          startDate: String,
          endDate: String,
          description: String,
        },
      ],
      default: [],
    },
    certification: {
      type: [String],
      default: [],
    },
    acheivements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const resumeModel = mongoose.model("Resume", resumeShema);
export default resumeModel;
