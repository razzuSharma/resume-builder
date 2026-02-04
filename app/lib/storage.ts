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
  PROJECT_DETAILS: 'resume_project_details',
  SKILLS: 'resume_skills',
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
  projects: unknown[];
  skills: string[];
  hobbies: string[];
}

/**
 * Export all resume data as a JSON object
 */
export const exportResumeData = (): ExportedResumeData => {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    personal: loadPersonalDetails(),
    education: loadEducationDetails(),
    experience: loadExperienceDetails(),
    projects: loadProjectDetails(),
    skills: loadSkills(),
    hobbies: loadHobbies(),
  };
};

/**
 * Import resume data from JSON
 * @returns true if successful, false otherwise
 */
export const importResumeData = (data: ExportedResumeData): boolean => {
  try {
    if (data.personal) savePersonalDetails(data.personal);
    if (data.education) saveEducationDetails(data.education);
    if (data.experience) saveExperienceDetails(data.experience);
    if (data.projects) saveProjectDetails(data.projects);
    if (data.skills) saveSkills(data.skills);
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
