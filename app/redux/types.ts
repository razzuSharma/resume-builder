// src/redux/types.ts
export interface PersonalDetail {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
  
  export interface EducationDetail {
    degree: string;
    institution: string;
    startYear: number;
    endYear: number;
  }
  
  export interface ExperienceDetail {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }
  
  export interface ProjectDetail {
    projectName: string;
    startDate: string;
    endDate: string;
    projectLink: string;
    skillsLearned: string[];
  }
  
  export type Skill = string;
  export type Hobby = string;
  
  export interface DataState {
    personalDetails: PersonalDetail[];
    educationDetails: EducationDetail[];
    experienceDetails: ExperienceDetail[];
    skills: Skill[];
    projects: ProjectDetail[];
    hobbies: Hobby[];
    loading: boolean;
    error: string | null;
  }
  