import { Types } from "mongoose";

export interface IPersonalInfo {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IProjects {
  title: string;
  description: string;
  githubUrl: string;
  LiveUrl: string;
  techStack: string[];
}

export interface IEducation {
  institute: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface IResume {
  _id?: string;
  user_id: Types.ObjectId;
  title: string;
  summary: string;
  personalInfo: IPersonalInfo;
  workExperience?: IWorkExperience[];
  projects: IProjects[];
  education: IEducation[];
  certification?: string[];
  acheivements?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
