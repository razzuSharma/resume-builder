// ============================================
// Type Definitions for Resume Artisan
// ============================================

// Personal Details
export interface PersonalDetails {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location?: string;
  summary?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  profile_image_url?: string;
  resume_pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Education
export interface Education {
  id?: string;
  user_id: string;
  school_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string | null;
  present: boolean;
  gpa?: string;
  description?: string;
  certificate_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Experience
export interface Experience {
  id?: string;
  user_id: string;
  company_name: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  present: boolean;
  responsibilities: string[];
  achievements?: string[];
  company_logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Project
export interface Project {
  id?: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date?: string | null;
  present: boolean;
  link?: string;
  github_link?: string;
  description: string;
  technologies?: string[];
  project_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Skills
export interface Skills {
  id?: string;
  user_id: string;
  skills: string[];
  categories?: SkillCategory[];
  created_at?: string;
  updated_at?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

// Hobbies
export interface Hobbies {
  id?: string;
  user_id: string;
  hobbies: string[];
  created_at?: string;
  updated_at?: string;
}

// Certification
export interface Certification {
  id?: string;
  user_id: string;
  name: string;
  issuing_organization: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  certificate_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Language
export interface Language {
  id?: string;
  user_id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
  created_at?: string;
}

// Complete Resume Data
export interface ResumeData {
  personal_details: PersonalDetails[];
  education_details: Education[];
  experience_details: Experience[];
  project_details: Project[];
  skills: Skills[];
  hobbies: Hobbies[];
  certifications?: Certification[];
  languages?: Language[];
}

// File Upload Types
export interface UploadedFile {
  path: string;
  publicUrl: string;
}

export type StorageBucket = 'profiles' | 'resumes' | 'projects' | 'certificates';
