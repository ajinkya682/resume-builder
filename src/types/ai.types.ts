export interface generateSummary {
  expressionLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface generateSkills {
  expressionLevel: string;
  jobTitle: string;
}

export interface generateProjectDescription {
  projectName: string;
  technologies: string[];
  features: string[];
}

export interface generateExperienceDescription {
  jobRole: string;
  experienceLevel: string;
  yearsOfExperience: number;
  techStack: string[];
}
