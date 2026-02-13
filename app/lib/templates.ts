export type TemplateId =
  | "classic"
  | "modern"
  | "compact"
  | "executive"
  | "minimal"
  | "creative";

export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  category: "ats" | "professional" | "creative";
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: "classic", name: "Classic", description: "Traditional single-column ATS-safe layout", category: "ats" },
  { id: "modern", name: "Modern", description: "Two-column layout with sidebar emphasis", category: "professional" },
  { id: "compact", name: "Compact", description: "Dense one-page layout with highlighted section bars", category: "ats" },
  { id: "executive", name: "Executive", description: "Boardroom style with strong hierarchy and clean separators", category: "professional" },
  { id: "minimal", name: "Minimal", description: "Elegant serif style with airy spacing and classic lines", category: "ats" },
  { id: "creative", name: "Creative", description: "Visual-forward two-column style for portfolio profiles", category: "creative" },
];

export interface JobTargetOption {
  id: string;
  label: string;
}

export const JOB_TARGET_OPTIONS: JobTargetOption[] = [
  { id: "general", label: "General / Any Industry" },
  { id: "retail_hospitality", label: "Retail / Hospitality" },
  { id: "admin_operations", label: "Admin / Operations" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "sales", label: "Sales" },
  { id: "skilled_trades", label: "Skilled Trades" },
  { id: "technology", label: "Technology" },
];

const TEMPLATE_RECOMMENDATION_MAP: Record<string, TemplateId> = {
  general: "classic",
  retail_hospitality: "minimal",
  admin_operations: "classic",
  healthcare: "compact",
  education: "classic",
  sales: "modern",
  skilled_trades: "compact",
  technology: "modern",
};

export const getRecommendedTemplate = (jobTarget: string): TemplateId => {
  return TEMPLATE_RECOMMENDATION_MAP[jobTarget] ?? "classic";
};

export const getTemplateById = (id: TemplateId) => {
  return TEMPLATE_OPTIONS.find((template) => template.id === id);
};
