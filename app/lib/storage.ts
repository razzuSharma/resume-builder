/**
 * Storage Utilities
 * 
 * Handles all localStorage operations for the resume builder.
 * All data stays in the browser - no server needed.
 * 
 * @module lib/storage
 */

const STORAGE_KEYS = {
  USER_ID: 'resume_user_id',
  PERSONAL_DETAILS: 'resume_personal_details',
  EDUCATION_DETAILS: 'resume_education_details',
  EXPERIENCE_DETAILS: 'resume_experience_details',
  VOLUNTEER_DETAILS: 'resume_volunteer_details',
  PROJECT_DETAILS: 'resume_project_details',
  SKILLS: 'resume_skills',
  JOB_TARGET: 'resume_job_target',
  SELECTED_TEMPLATE: 'resume_selected_template',
  FONT_SIZE: 'resume_font_size',
  HOBBIES: 'resume_hobbies',
  THEME: 'theme',
  COLOR_VARIANT: 'colorVariant',
} as const;

// ============================================================================
// User ID Management
// ============================================================================

/**
 * Generate or retrieve the unique user ID for this browser
 */
export const getUserId = (): string => {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
};

// ============================================================================
// Generic Storage Helpers
// ============================================================================

export const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// ============================================================================
// Resume Data Specific
// ============================================================================

export const savePersonalDetails = (data: unknown) => 
  saveToStorage(STORAGE_KEYS.PERSONAL_DETAILS, data);

export const loadPersonalDetails = () => 
  loadFromStorage(STORAGE_KEYS.PERSONAL_DETAILS, null);

export const clearPersonalDetails = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PERSONAL_DETAILS);
};

export const saveEducationDetails = (data: unknown[]) => 
  saveToStorage(STORAGE_KEYS.EDUCATION_DETAILS, data);

export const loadEducationDetails = () => 
  loadFromStorage(STORAGE_KEYS.EDUCATION_DETAILS, []);

export const clearEducationDetails = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.EDUCATION_DETAILS);
};

export const saveExperienceDetails = (data: unknown[]) => 
  saveToStorage(STORAGE_KEYS.EXPERIENCE_DETAILS, data);

export const loadExperienceDetails = () => 
  loadFromStorage(STORAGE_KEYS.EXPERIENCE_DETAILS, []);

export const clearExperienceDetails = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.EXPERIENCE_DETAILS);
};

export const saveVolunteerDetails = (data: unknown[]) => 
  saveToStorage(STORAGE_KEYS.VOLUNTEER_DETAILS, data);

export const loadVolunteerDetails = () => 
  loadFromStorage(STORAGE_KEYS.VOLUNTEER_DETAILS, []);

export const clearVolunteerDetails = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.VOLUNTEER_DETAILS);
};

export const saveProjectDetails = (data: unknown[]) => 
  saveToStorage(STORAGE_KEYS.PROJECT_DETAILS, data);

export const loadProjectDetails = () => 
  loadFromStorage(STORAGE_KEYS.PROJECT_DETAILS, []);

export const clearProjectDetails = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PROJECT_DETAILS);
};

export const saveSkills = (data: string[]) => 
  saveToStorage(STORAGE_KEYS.SKILLS, data);

export const loadSkills = () => 
  loadFromStorage(STORAGE_KEYS.SKILLS, []);

export const clearSkills = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SKILLS);
};

export const saveJobTarget = (data: string) =>
  saveToStorage(STORAGE_KEYS.JOB_TARGET, data);

export const loadJobTarget = () =>
  loadFromStorage(STORAGE_KEYS.JOB_TARGET, "general");

export const clearJobTarget = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.JOB_TARGET);
};

export const saveSelectedTemplate = (data: string) => {
  saveToStorage(STORAGE_KEYS.SELECTED_TEMPLATE, data);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('resumeTemplateUpdated'));
  }
};

export const loadSelectedTemplate = () =>
  loadFromStorage(STORAGE_KEYS.SELECTED_TEMPLATE, "classic");

export const clearSelectedTemplate = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SELECTED_TEMPLATE);
};

export type ResumeFontSize = "small" | "medium" | "large";

export const saveResumeFontSize = (data: ResumeFontSize) =>
  saveToStorage(STORAGE_KEYS.FONT_SIZE, data);

export const loadResumeFontSize = (): ResumeFontSize =>
  loadFromStorage(STORAGE_KEYS.FONT_SIZE, "medium");

export const clearResumeFontSize = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.FONT_SIZE);
};

export const saveHobbies = (data: string[]) => 
  saveToStorage(STORAGE_KEYS.HOBBIES, data);

export const loadHobbies = () => 
  loadFromStorage(STORAGE_KEYS.HOBBIES, []);

export const clearHobbies = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.HOBBIES);
};

// ============================================================================
// Export/Import
// ============================================================================

export interface ExportedResumeData {
  version: string;
  exportedAt: string;
  personal: unknown;
  education: unknown[];
  experience: unknown[];
  volunteer?: unknown[];
  projects: unknown[];
  skills: string[];
  jobTarget?: string;
  selectedTemplate?: string;
  fontSize?: ResumeFontSize;
  hobbies: string[];
}

const EUROPASS_ONLY_PERSONAL_FIELDS = [
  "permanent_address",
  "nationality",
  "date_of_birth",
  "gender",
  "declaration_text",
  "passport_number",
  "passport_issue_date",
  "passport_expiry_date",
  "father_name",
  "marital_status",
] as const;

const sanitizePersonalByTemplate = (personal: unknown, selectedTemplate: string) => {
  if (!personal || typeof personal !== "object") return personal;
  if (selectedTemplate === "europass") return personal;

  const sanitized = { ...(personal as Record<string, unknown>) };
  EUROPASS_ONLY_PERSONAL_FIELDS.forEach((field) => {
    delete sanitized[field];
  });
  return sanitized;
};

/**
 * Export all resume data as a JSON object
 */
export const exportResumeData = (): ExportedResumeData => {
  const selectedTemplate = loadSelectedTemplate();
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    personal: sanitizePersonalByTemplate(loadPersonalDetails(), selectedTemplate),
    education: loadEducationDetails(),
    experience: loadExperienceDetails(),
    volunteer: loadVolunteerDetails(),
    projects: loadProjectDetails(),
    skills: loadSkills(),
    jobTarget: loadJobTarget(),
    selectedTemplate,
    fontSize: loadResumeFontSize(),
    hobbies: loadHobbies(),
  };
};

/**
 * Import resume data from JSON
 * @returns true if successful, false otherwise
 */
export const importResumeData = (data: ExportedResumeData): boolean => {
  try {
    const selectedTemplate = data.selectedTemplate ?? loadSelectedTemplate();
    if (data.personal) {
      savePersonalDetails(sanitizePersonalByTemplate(data.personal, selectedTemplate));
    }
    if (data.education) saveEducationDetails(data.education);
    if (data.experience) saveExperienceDetails(data.experience);
    if (data.volunteer) saveVolunteerDetails(data.volunteer);
    if (data.projects) saveProjectDetails(data.projects);
    if (data.skills) saveSkills(data.skills);
    if (data.jobTarget) saveJobTarget(data.jobTarget);
    if (data.selectedTemplate) saveSelectedTemplate(data.selectedTemplate);
    if (data.fontSize) saveResumeFontSize(data.fontSize);
    if (data.hobbies) saveHobbies(data.hobbies);
    notifyResumeUpdate();
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Validate imported data structure
 */
export const validateImportData = (data: unknown): data is ExportedResumeData => {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    'version' in d &&
    'exportedAt' in d &&
    ('personal' in d || 'education' in d || 'experience' in d)
  );
};

// ============================================================================
// Utilities
// ============================================================================

/**
 * Clear all resume data
 */
export const clearAllResumeData = (): void => {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Check if user has any saved resume data
 */
export const hasResumeData = (): boolean => {
  return !!loadPersonalDetails();
};

/**
 * Get storage usage info
 */
export const getStorageInfo = () => {
  if (typeof window === 'undefined') return { used: 0, total: 0, percentage: 0 };
  
  let used = 0;
  Object.values(STORAGE_KEYS).forEach(key => {
    const item = localStorage.getItem(key);
    if (item) used += item.length * 2; // UTF-16 = 2 bytes per char
  });
  
  // localStorage limit is typically 5-10MB
  const total = 5 * 1024 * 1024; // 5MB estimate
  
  return {
    used,
    total,
    percentage: Math.round((used / total) * 100),
    formatted: `${(used / 1024).toFixed(1)} KB / ${(total / 1024 / 1024).toFixed(1)} MB`,
  };
};

// ============================================================================
// Event Handling
// ============================================================================

/**
 * Notify components that resume data has been updated
 * Use this after any save operation
 */
export const notifyResumeUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('resumeDataUpdated'));
  }
};

/**
 * Hook to listen for resume data changes
 */
export const subscribeToResumeUpdates = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const handler = () => callback();
  window.addEventListener('resumeDataUpdated', handler);
  return () => window.removeEventListener('resumeDataUpdated', handler);
};
