"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Briefcase,
  HandHeart,
  FolderGit2,
  Heart,
  Wand2,
  CheckCircle2,
  ChevronRight,
  Eye,
  Download,
  Save,
  Menu,
  X,
} from "lucide-react";
import PersonalDetails from "../pages/PersonalDetails";
import EducationDetails from "../pages/EducationDetails";
import ExperienceDetails from "../pages/ExperienceDetails";
import SkillsDetails from "../pages/SkillsDetails";
import ProjectDetails from "../pages/ProjectDetails";
import VolunteerDetails from "../pages/VolunteerDetails";
import HobbiesDetails from "../pages/HobbiesDetails";
import LivePreview from "../components/LivePreview";
import { 
  hasResumeData, 
  loadPersonalDetails,
  loadEducationDetails,
  loadExperienceDetails,
  loadVolunteerDetails,
  loadProjectDetails,
  loadJobTarget,
  loadSelectedTemplate,
  saveJobTarget,
  saveSelectedTemplate,
  loadSkills,
  loadHobbies 
} from "../lib/storage";
import { useTheme } from "../components/ThemeProvider";
import { TEMPLATE_OPTIONS, JOB_TARGET_OPTIONS, getRecommendedTemplate, getTemplateById, type TemplateId } from "../lib/templates";

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType<{ onNext: () => void }>;
  color: string;
  hasData: () => boolean;
}

const ResumePage = () => {
  const router = useRouter();
  const { colorVariant } = useTheme();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [jobTarget, setJobTarget] = useState("general");
  const [showResumeDataPrompt, setShowResumeDataPrompt] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Define steps with data checkers
  const steps: Step[] = [
    {
      id: "PersonalDetails",
      label: "Personal",
      icon: User,
      component: PersonalDetails,
      color: "from-teal-500 to-cyan-500",
      hasData: () => !!loadPersonalDetails(),
    },
    {
      id: "EducationDetails",
      label: "Education",
      icon: GraduationCap,
      component: EducationDetails,
      color: "from-purple-500 to-pink-500",
      hasData: () => loadEducationDetails().length > 0,
    },
    {
      id: "ExperienceDetails",
      label: "Experience",
      icon: Briefcase,
      component: ExperienceDetails,
      color: "from-amber-500 to-orange-500",
      hasData: () => loadExperienceDetails().length > 0,
    },
    {
      id: "VolunteerDetails",
      label: "Volunteer",
      icon: HandHeart,
      component: VolunteerDetails,
      color: "from-fuchsia-500 to-purple-500",
      hasData: () => loadVolunteerDetails().length > 0,
    },
    {
      id: "ProjectDetails",
      label: "Work Samples",
      icon: FolderGit2,
      component: ProjectDetails,
      color: "from-emerald-500 to-teal-500",
      hasData: () => loadProjectDetails().length > 0,
    },
    {
      id: "HobbiesDetails",
      label: "Hobbies",
      icon: Heart,
      component: HobbiesDetails,
      color: "from-pink-500 to-rose-500",
      hasData: () => loadHobbies().length > 0,
    },
    {
      id: "SkillsDetails",
      label: "Skills",
      icon: Wand2,
      component: SkillsDetails,
      color: "from-blue-500 to-indigo-500",
      hasData: () => loadSkills().length > 0,
    },
  ];

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Live preview is desktop-only
  useEffect(() => {
    if (isMobile && showPreview) {
      setShowPreview(false);
    }
  }, [isMobile, showPreview]);

  // Hydrate completed steps from localStorage on mount
  useEffect(() => {
    const target = loadJobTarget();
    const storedTemplate = loadSelectedTemplate() as TemplateId;
    setJobTarget(target);
    setSelectedTemplate(storedTemplate);

    // Check which steps have existing data
    const stepsWithData = new Set<number>();
    steps.forEach((step, index) => {
      if (step.hasData()) {
        stepsWithData.add(index);
      }
    });
    
    if (stepsWithData.size > 0) {
      setCompletedSteps(stepsWithData);
      setShowResumeDataPrompt(true);
    }
    
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recommendedTemplate = getRecommendedTemplate(jobTarget);

  const handleNext = () => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.add(activeStepIndex);
      return newSet;
    });
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      router.push("/resume");
    }
  };

  const handleStepClick = (index: number) => {
    // Allow clicking on:
    // 1. Any step that has data (completed or saved)
    // 2. The current step
    // 3. The next step after the last completed step
    const maxCompleted = Math.max(...Array.from(completedSteps), -1);
    const canClick = completedSteps.has(index) || 
                     index === activeStepIndex || 
                     index <= maxCompleted + 1;
    
    if (canClick) {
      setActiveStepIndex(index);
    }
  };

  const handleClearData = () => {
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("resume_")) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
    }
  };

  const ActiveComponent = steps[activeStepIndex].component;

  // Don't render until hydrated to prevent flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900/50">
      {/* Resume Data Prompt */}
      {showResumeDataPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mb-4 sm:mb-6 px-4 sm:px-0"
        >
          <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Save className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <p className="text-sm sm:text-base text-teal-800 dark:text-teal-200">
                We found your saved resume data. You can continue editing or start fresh.
              </p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setShowResumeDataPrompt(false)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-500/20 rounded-lg transition-colors"
              >
                Continue
              </button>
              <button
                onClick={handleClearData}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Create Your Resume
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Fill in your details step by step. Your progress is automatically saved locally.
            <span className="hidden sm:inline">
              <br />
              <span className="text-sm text-teal-600 dark:text-teal-400">
                Click on any completed section to edit it.
              </span>
            </span>
          </p>
        </div>

        {/* Job Target + Template Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Target</label>
                <select
                  value={jobTarget}
                  onChange={(e) => {
                    setJobTarget(e.target.value);
                    saveJobTarget(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {JOB_TARGET_OPTIONS.map((target) => (
                    <option key={target.id} value={target.id}>{target.label}</option>
                  ))}
                </select>
              </div>
              <div className="lg:w-80">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Recommended template:
                  <span className="ml-1 font-semibold text-teal-700 dark:text-teal-300">
                    {getTemplateById(recommendedTemplate)?.name}
                  </span>
                </p>
                <button
                  onClick={() => {
                    setSelectedTemplate(recommendedTemplate);
                    saveSelectedTemplate(recommendedTemplate);
                  }}
                  className="mt-2 px-3 py-2 text-sm rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-500/30 transition-colors"
                >
                  Use Recommended
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEMPLATE_OPTIONS.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    saveSelectedTemplate(template.id);
                  }}
                  className={`text-left p-3 rounded-xl border transition-colors ${
                    selectedTemplate === template.id
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">{template.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview + Export */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">

          {!isMobile && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                showPreview
                  ? "bg-teal-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{showPreview ? "Hide Preview" : "Live Preview"}</span>
              <span className="sm:hidden">Preview</span>
            </button>
          )}

          <button
            onClick={() => router.push("/resume")}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:from-teal-700 hover:to-cyan-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Finish & Export</span>
            <span className="sm:hidden">Finish</span>
          </button>
        </div>

        {/* Mobile Step Navigation */}
        {isMobile && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <span className="font-medium">{steps[activeStepIndex].label}</span>
                <span className="text-xs text-gray-400">
                  ({activeStepIndex + 1}/{steps.length})
                </span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round((completedSteps.size / steps.length) * 100)}%
                </span>
                <div className="w-16 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                    style={{
                      width: `${((completedSteps.size + (activeStepIndex > Math.max(...Array.from(completedSteps)) ? 0 : 1)) / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <nav className="p-2 space-y-1">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === activeStepIndex;
                      const isCompleted = completedSteps.has(index);
                      const hasData = step.hasData();
                      const isClickable = isCompleted || isActive || index <= Math.max(...Array.from(completedSteps), -1) + 1;

                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            handleStepClick(index);
                            setIsMobileMenuOpen(false);
                          }}
                          disabled={!isClickable}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r " + step.color + " text-white shadow"
                              : isCompleted || hasData
                              ? "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200"
                              : isClickable
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                            isActive ? "bg-white/20" : isCompleted || hasData ? "text-green-500" : ""
                          }`}>
                            {(isCompleted || hasData) && !isActive ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{step.label}</span>
                          {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                      );
                    })}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sticky top-24">
              <nav className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === activeStepIndex;
                  const isCompleted = completedSteps.has(index);
                  const hasData = step.hasData();
                  const isClickable = isCompleted || isActive || index <= Math.max(...Array.from(completedSteps), -1) + 1;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      disabled={!isClickable}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r " + step.color + " text-white shadow-lg"
                          : isCompleted || hasData
                          ? "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          : isClickable
                          ? "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive
                            ? "bg-white/20"
                            : isCompleted || hasData
                            ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        {(isCompleted || hasData) && !isActive ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{step.label}</span>
                        {(isCompleted || hasData) && !isActive && (
                          <span className="text-xs text-green-600 dark:text-green-400 ml-2">(saved)</span>
                        )}
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Progress */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round((completedSteps.size / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                    style={{
                      width: `${((completedSteps.size + (activeStepIndex > Math.max(...Array.from(completedSteps)) ? 0 : 1)) / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Auto-save indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Auto-saving locally
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ActiveComponent onNext={handleNext} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      {!isMobile && (
        <LivePreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          template={selectedTemplate}
          colorVariant={colorVariant}
        />
      )}
    </div>
  );
};

export default ResumePage;
