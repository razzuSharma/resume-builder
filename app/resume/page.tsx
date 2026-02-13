"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Edit3,
  Sparkles,
  Loader2,
  ArrowLeft,
  Printer,
  CheckCircle2,
  ChevronDown,
  Palette,
  Database,
  ZoomIn,
  ZoomOut,
  LayoutTemplate,
  AlertTriangle,
  Gauge,
} from "lucide-react";
import ModernTemplate from "../components/resume-templates/ModernTemplate";
import ClassicTemplate from "../components/resume-templates/ClassicTemplate";
import { CompactTemplate, ExecutiveTemplate, MinimalTemplate } from "../components/resume-templates/ExtendedTemplates";
import DataManager from "../components/DataManager";
import { useTheme, type ColorVariant } from "../components/ThemeProvider";
import {
  loadPersonalDetails,
  loadEducationDetails,
  loadExperienceDetails,
  loadVolunteerDetails,
  loadProjectDetails,
  loadJobTarget,
  loadSkills,
  loadHobbies,
} from "../lib/storage";
import { TEMPLATE_OPTIONS, getTemplateById, getRecommendedTemplate, type TemplateId } from "../lib/templates";

const colorVariants: { id: ColorVariant; name: string; hex: string }[] = [
  { id: "slate", name: "Slate", hex: "#334155" },
  { id: "teal", name: "Teal", hex: "#0d9488" },
  { id: "navy", name: "Navy", hex: "#1d4ed8" },
  { id: "rose", name: "Rose", hex: "#e11d48" },
  { id: "forest", name: "Forest", hex: "#15803d" },
  { id: "violet", name: "Violet", hex: "#7c3aed" },
];

interface ResumeData {
  personal_details: any[];
  education_details: any[];
  experience_details: any[];
  volunteer_details: any[];
  skills: any[];
  project_details: any[];
  hobbies: any[];
}

const getOptimalScale = (): number => {
  if (typeof window === "undefined") return 1;
  const a4WidthPx = 210 * 3.7795275591;
  const viewportWidth = window.innerWidth;
  const minPadding = 80;
  
  if (viewportWidth >= 1200) return 1;
  if (viewportWidth >= 992) return 0.9;
  
  const availableWidth = viewportWidth - minPadding;
  return Math.min(1, availableWidth / a4WidthPx);
};

const ResumePage: React.FC = () => {
  const router = useRouter();
  const { colorVariant, setColorVariant } = useTheme();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [jobTarget, setJobTarget] = useState("general");
  const [isAtsExpanded, setIsAtsExpanded] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResumeData>({
    personal_details: [],
    education_details: [],
    experience_details: [],
    volunteer_details: [],
    skills: [],
    project_details: [],
    hobbies: [],
  });

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".color-menu-container")) setShowColorMenu(false);
      if (!target.closest(".template-picker-container")) setShowTemplatePicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = () => {
      const personal = loadPersonalDetails();
      const education = loadEducationDetails();
      const experience = loadExperienceDetails();
      const volunteer = loadVolunteerDetails();
      const projects = loadProjectDetails();
      const skillsRaw = loadSkills();
      const hobbiesRaw = loadHobbies();
      const target = loadJobTarget();

      setData({
        personal_details: personal ? [personal] : [],
        education_details: education,
        experience_details: experience,
        volunteer_details: volunteer,
        project_details: projects,
        skills: skillsRaw.map((s: string, i: number) => ({ id: i, skill_name: s })),
        hobbies: hobbiesRaw.map((h: string, i: number) => ({ id: i, hobby_name: h })),
      });
      setJobTarget(target);
      setLoading(false);
    };

    loadData();
    setPreviewScale(getOptimalScale());

    const handleResize = () => setPreviewScale(getOptimalScale());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPDF(true);
    try {
      window.print();
      setPdfGenerated(true);
      setTimeout(() => setPdfGenerated(false), 3000);
    } catch (error) {
      console.error("Error opening print dialog:", error);
      alert("Failed to open print dialog. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => window.print();
  const handleEdit = () => router.push("/create-resume");
  const zoomIn = () => setPreviewScale((s) => Math.min(s + 0.1, 1.5));
  const zoomOut = () => setPreviewScale((s) => Math.max(s - 0.1, 0.5));

  const hasData = data.personal_details.length > 0 || data.education_details.length > 0;

  const TemplateComponent = (() => {
    switch (selectedTemplate) {
      case "modern":
      case "creative":
        return ModernTemplate;
      case "compact":
        return CompactTemplate;
      case "executive":
        return ExecutiveTemplate;
      case "minimal":
        return MinimalTemplate;
      case "classic":
      default:
        return ClassicTemplate;
    }
  })();

  const recommendedTemplate = getRecommendedTemplate(jobTarget);

  const atsReport = React.useMemo(() => {
    const issues: Array<{ severity: "high" | "medium" | "low"; text: string; action: string }> = [];
    let score = 100;

    const personal = data.personal_details[0] || {};
    const hasEmail = !!personal.email;
    const hasPhone = !!personal.phone;
    const summaryLength = (personal.summary || "").trim().length;
    const skillsCount = data.skills.length;
    const hasEducation = data.education_details.length > 0;
    const hasExperience = data.experience_details.length > 0 || data.volunteer_details.length > 0;

    const bulletCount =
      data.experience_details.reduce((sum, exp) => sum + (exp.responsibilities || []).filter((r: string) => r && r.trim()).length, 0) +
      data.volunteer_details.reduce((sum, v) => sum + (v.contributions || []).filter((c: string) => c && c.trim()).length, 0);

    if (!hasEmail || !hasPhone) {
      score -= 12;
      issues.push({
        severity: "high",
        text: "Missing critical contact information",
        action: "Add both email and phone in Personal Details.",
      });
    }

    if (summaryLength === 0) {
      score -= 8;
      issues.push({
        severity: "medium",
        text: "No professional summary found",
        action: "Add a 2-4 sentence summary tailored to your target role.",
      });
    } else if (summaryLength < 60 || summaryLength > 700) {
      score -= 4;
      issues.push({
        severity: "low",
        text: "Summary length may reduce readability",
        action: "Keep summary between ~60 and 700 characters.",
      });
    }

    if (!hasEducation) {
      score -= 10;
      issues.push({
        severity: "high",
        text: "Education section is empty",
        action: "Add at least one education entry.",
      });
    }

    if (!hasExperience) {
      score -= 15;
      issues.push({
        severity: "high",
        text: "No experience or volunteer section content",
        action: "Add work or volunteer entries with measurable outcomes.",
      });
    }

    if (skillsCount < 5) {
      score -= 10;
      issues.push({
        severity: "medium",
        text: "Skills section is too small",
        action: "Add at least 5 role-relevant skills.",
      });
    } else if (skillsCount > 30) {
      score -= 3;
      issues.push({
        severity: "low",
        text: "Skills list may be too broad",
        action: "Prioritize the most relevant 10-20 skills for the role.",
      });
    }

    if (bulletCount < 3) {
      score -= 10;
      issues.push({
        severity: "medium",
        text: "Not enough accomplishment bullets",
        action: "Add at least 3 achievement/responsibility bullets.",
      });
    }

    if (data.project_details.length === 0) {
      score -= 3;
      issues.push({
        severity: "low",
        text: "No work samples/projects added",
        action: "Add 1-2 work samples if relevant to your role.",
      });
    }

    score = Math.max(0, Math.min(100, score));
    const level = score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 55 ? "Fair" : "Needs Work";
    return { score, level, issues };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Resume Data Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Create your professional resume now!</p>
          <button
            onClick={() => router.push("/create-resume")}
            className="inline-flex items-center gap-2 px-8 py-4 text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Create Your Resume
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        {/* 
          HEADER SECTION
          - isolate: creates new stacking context
          - z-30: ensures header stays above preview (z-10)
          - relative: positioning context for dropdowns
        */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative z-30 isolate flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 print:hidden"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Your Resume</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Preview and download your professional resume (A4 Format)</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
              <button onClick={zoomOut} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Zoom out">
                <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-14 text-center">{Math.round(previewScale * 100)}%</span>
              <button onClick={zoomIn} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Zoom in">
                <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Template Picker */}
            <div className="relative template-picker-container">
              <button
                onClick={() => {
                  setShowTemplatePicker(!showTemplatePicker);
                  setShowColorMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-500 transition-colors"
              >
                <LayoutTemplate className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{getTemplateById(selectedTemplate)?.name || selectedTemplate}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTemplatePicker ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showTemplatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 w-[320px] sm:w-[420px]"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TEMPLATE_OPTIONS.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setShowTemplatePicker(false);
                          }}
                          className={`p-2 rounded-lg text-left border transition-colors ${
                            selectedTemplate === template.id
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-500/20"
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          <p className={`text-sm font-semibold ${selectedTemplate === template.id ? "text-teal-700 dark:text-teal-300" : "text-gray-700 dark:text-gray-200"}`}>
                            {template.name}
                          </p>
                          <p className="text-[11px] mt-1 text-gray-500 dark:text-gray-400 line-clamp-2">
                            {template.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Color Variant Selector */}
            <div className="relative color-menu-container">
              <button
                onClick={() => {
                  setShowColorMenu(!showColorMenu);
                  setShowTemplatePicker(false);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-500 transition-colors"
              >
                <Palette className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{colorVariant}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showColorMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showColorMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50"
                  >
                    <div className="grid grid-cols-2 gap-1 min-w-[160px]">
                      {colorVariants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => { setColorVariant(variant.id); setShowColorMenu(false); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            colorVariant === variant.id ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: variant.hex }} />
                          <span className={`text-sm ${colorVariant === variant.id ? "font-medium text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                            {variant.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other buttons */}
            <button onClick={() => setShowDataManager(true)} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 transition-colors">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Data</span>
            </button>

            <button onClick={handleEdit} className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Edit</span>
            </button>

            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Print</span>
            </button>

            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-medium">...</span></>
              ) : pdfGenerated ? (
                <><CheckCircle2 className="w-4 h-4" /><span className="text-sm font-medium">Done!</span></>
              ) : (
                <><Download className="w-4 h-4" /><span className="text-sm font-medium">PDF</span></>
              )}
            </button>
          </div>
        </motion.div>

        {/* ATS Readiness Panel */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 print:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-teal-700 dark:text-teal-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">ATS Readiness</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {atsReport.score}/100
                  <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">({atsReport.level})</span>
                </p>
              </div>
            </div>

            <div className="lg:ml-auto text-sm text-gray-600 dark:text-gray-300">
              Recommended template for your target role:
              <span className="ml-1 font-semibold text-teal-700 dark:text-teal-300">
                {getTemplateById(recommendedTemplate)?.name}
              </span>
              {selectedTemplate !== recommendedTemplate && (
                <button
                  onClick={() => setSelectedTemplate(recommendedTemplate)}
                  className="ml-3 px-3 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-500/30 transition-colors"
                >
                  Apply
                </button>
              )}
            </div>
            <button
              onClick={() => setIsAtsExpanded((prev) => !prev)}
              className="lg:ml-4 inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
            >
              {isAtsExpanded ? "Hide details" : "Show details"}
              <ChevronDown className={`w-4 h-4 transition-transform ${isAtsExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isAtsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {atsReport.issues.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {atsReport.issues.slice(0, 6).map((issue, idx) => (
                      <div key={idx} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                        <div className="flex items-start gap-2">
                          {issue.severity === "high" ? (
                            <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{issue.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-800 p-3 bg-emerald-50/60 dark:bg-emerald-900/20 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Strong ATS structure. Keep tailoring keywords for each job.</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {!isAtsExpanded && atsReport.issues.length > 0 && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Top issues:
              <span className="ml-1">
                {atsReport.issues
                  .slice(0, 2)
                  .map((issue) => issue.text)
                  .join(" • ")}
              </span>
            </div>
          )}
        </motion.div>

        {/* 
          PREVIEW SECTION
          - z-10: lower than header (z-30)
          - No overflow-x-auto here (moved to inner wrapper if needed)
          - Transform scale applied to inner content only
        */}
        <div className="relative z-10 flex justify-center pb-4 print:block print:z-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="print:m-0 print:shadow-none print-reset-transform"
            style={{ 
              transform: `scale(${previewScale})`, 
              transformOrigin: "top center", 
              transition: "transform 0.2s ease-out",
            }}
          >
            <div
              ref={pdfRef}
              id="resume-print-root"
              className={`resume-paper resume-variant-${colorVariant} resume-template-${selectedTemplate} bg-white shadow-2xl print:shadow-none`}
              style={{ width: "210mm", minHeight: "297mm", boxSizing: "border-box" }}
            >
              <TemplateComponent
                personal_details={data.personal_details}
                education_details={data.education_details}
                experience_details={data.experience_details}
                volunteer_details={data.volunteer_details}
                skills={data.skills}
                project_details={data.project_details}
                hobbies={data.hobbies}
                variant={selectedTemplate}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <DataManager isOpen={showDataManager} onClose={() => setShowDataManager(false)} />
    </div>
  );
};

export default ResumePage;
