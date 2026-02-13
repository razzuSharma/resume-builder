"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Maximize2, Minimize2, GripVertical } from "lucide-react";
import ModernTemplate from "./resume-templates/ModernTemplate";
import ClassicTemplate from "./resume-templates/ClassicTemplate";
import { useTheme, type ColorVariant } from "./ThemeProvider";
import { notifyResumeUpdate } from "../lib/storage";

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template?: "modern" | "classic";
  colorVariant?: ColorVariant;
}

// Custom hook to listen for localStorage changes
const useResumeData = () => {
  const [data, setData] = useState({
    personal: null as any,
    education: [] as any[],
    experience: [] as any[],
    volunteer: [] as any[],
    projects: [] as any[],
    skills: [] as string[],
    hobbies: [] as string[],
  });

  const loadData = () => {
    if (typeof window === "undefined") return;
    
    const personal = localStorage.getItem("resume_personal_details");
    const education = localStorage.getItem("resume_education_details");
    const experience = localStorage.getItem("resume_experience_details");
    const volunteer = localStorage.getItem("resume_volunteer_details");
    const projects = localStorage.getItem("resume_project_details");
    const skills = localStorage.getItem("resume_skills");
    const hobbies = localStorage.getItem("resume_hobbies");

    setData({
      personal: personal ? JSON.parse(personal) : null,
      education: education ? JSON.parse(education) : [],
      experience: experience ? JSON.parse(experience) : [],
      volunteer: volunteer ? JSON.parse(volunteer) : [],
      projects: projects ? JSON.parse(projects) : [],
      skills: skills ? JSON.parse(skills) : [],
      hobbies: hobbies ? JSON.parse(hobbies) : [],
    });
  };

  useEffect(() => {
    loadData();
    
    // Listen for storage changes (from other tabs) and custom events
    const handleStorageChange = () => loadData();
    const handleResumeUpdate = () => loadData();
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("resumeDataUpdated", handleResumeUpdate);
    
    // Poll for changes every 500ms as fallback
    const interval = setInterval(loadData, 500);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("resumeDataUpdated", handleResumeUpdate);
      clearInterval(interval);
    };
  }, []);

  return data;
};

// Re-export for convenience
export { notifyResumeUpdate } from "../lib/storage";

// Constants
const MIN_WIDTH = 320; // Minimum width in pixels
const MAX_WIDTH_RATIO = 0.9; // Maximum width as ratio of viewport
const DEFAULT_WIDTH = 600; // Default width in pixels

const LivePreview: React.FC<LivePreviewProps> = ({ isOpen, onClose, template = "classic", colorVariant: propColorVariant }) => {
  const { colorVariant: themeColorVariant } = useTheme();
  const colorVariant = propColorVariant || themeColorVariant;
  const resumeData = useResumeData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Hide hint after 5 seconds
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    resizeStartX.current = clientX;
    resizeStartWidth.current = panelWidth;
  }, [panelWidth]);

  // Handle resize move
  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (clientX: number) => {
      const deltaX = resizeStartX.current - clientX;
      const newWidth = Math.max(
        MIN_WIDTH,
        Math.min(
          window.innerWidth * MAX_WIDTH_RATIO,
          resizeStartWidth.current + deltaX
        )
      );
      setPanelWidth(newWidth);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    
    const handleEnd = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isResizing]);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => onClose()}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Eye className="w-5 h-5" />
        <span className="font-medium hidden sm:inline">Live Preview</span>
      </motion.button>
    );
  }

  const TemplateComponent = template === "classic" ? ClassicTemplate : ModernTemplate;

  // Calculate scale based on panel width and A4 width (210mm ≈ 794px at 96dpi)
  const A4_WIDTH_PX = 794;
  const scale = Math.min(1, (panelWidth - 64) / A4_WIDTH_PX);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, x: 300 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          width: isMobile ? "100%" : (isExpanded ? "100%" : panelWidth),
        }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed top-0 right-0 h-full bg-gray-50 dark:bg-gray-900 shadow-2xl z-50 flex flex-col`}
        style={{ 
          width: isMobile ? "100%" : (isExpanded ? "100%" : panelWidth),
          maxWidth: "100%",
        }}
      >
        {/* Resize Handle - Hidden on mobile */}
        {!isMobile && !isExpanded && (
          <div
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            className={`absolute left-0 top-0 bottom-0 w-6 cursor-col-resize z-10 flex items-center justify-center hover:bg-teal-500/10 transition-colors ${
              isResizing ? "bg-teal-500/20" : ""
            }`}
            style={{ transform: "translateX(-50%)" }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <GripVertical className="w-4 h-4 text-gray-400" />
              <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Live Preview</h3>
            </div>
            {showHint && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="hidden sm:inline text-xs bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-full"
              >
                Updates automatically
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content - A4 Sized with responsive scaling */}
        <div 
          className="flex-1 overflow-auto p-2 sm:p-4 bg-gray-100 dark:bg-gray-900"
          style={{ 
            display: "flex",
            justifyContent: "center",
          }}
        >
          {resumeData.personal ? (
            <motion.div
              key={template + colorVariant}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-2xl"
              style={{ 
                width: isMobile ? "100%" : "210mm",
                minHeight: isMobile ? "auto" : "297mm",
                maxWidth: "100%",
                boxSizing: "border-box",
                transform: isMobile ? "none" : `scale(${scale})`,
                transformOrigin: "top center",
              }}
            >
              <div style={{ 
                width: "100%",
                overflow: "auto",
              }}>
                <TemplateComponent
                  personal_details={resumeData.personal ? [resumeData.personal] : []}
                  education_details={resumeData.education}
                  experience_details={resumeData.experience}
                  volunteer_details={resumeData.volunteer}
                  project_details={resumeData.projects}
                  skills={resumeData.skills.map((s, i) => ({ id: i, skill_name: s }))}
                  hobbies={resumeData.hobbies.map((h, i) => ({ id: i, hobby_name: h }))}
                />
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 sm:h-96 text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <EyeOff className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h4 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No data yet
              </h4>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xs">
                Start filling in your personal details to see your resume come to life!
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400">
              <span>Template: <span className="font-medium text-gray-900 dark:text-white capitalize">{template}</span></span>
              <span className="hidden sm:inline">Color: <span className="font-medium text-gray-900 dark:text-white capitalize">{colorVariant}</span></span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {!isMobile && !isExpanded && (
                <span className="text-gray-400 text-xs">
                  Drag edge to resize
                </span>
              )}
              {resumeData.personal && (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LivePreview;
