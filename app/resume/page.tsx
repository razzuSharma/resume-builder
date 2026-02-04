"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
} from "lucide-react";
import ModernTemplate from "../components/resume-templates/ModernTemplate";
import ClassicTemplate from "../components/resume-templates/ClassicTemplate";
import DataManager from "../components/DataManager";
import { useTheme, type ColorVariant } from "../components/ThemeProvider";
import {
  loadPersonalDetails,
  loadEducationDetails,
  loadExperienceDetails,
  loadProjectDetails,
  loadSkills,
  loadHobbies,
} from "../lib/storage";

const colorVariants: { id: ColorVariant; name: string; color: string }[] = [
  { id: "slate", name: "Slate", color: "bg-slate-600" },
  { id: "teal", name: "Teal", color: "bg-teal-600" },
  { id: "navy", name: "Navy", color: "bg-blue-700" },
  { id: "rose", name: "Rose", color: "bg-rose-600" },
  { id: "forest", name: "Forest", color: "bg-green-700" },
  { id: "violet", name: "Violet", color: "bg-violet-600" },
];

const templates = [
  { id: "modern", name: "Modern", description: "Two-column with sidebar" },
  { id: "classic", name: "Classic", description: "Traditional single-column" },
] as const;

interface ResumeData {
  personal_details: any[];
  education_details: any[];
  experience_details: any[];
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
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "classic">("classic");
  const [previewScale, setPreviewScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResumeData>({
    personal_details: [],
    education_details: [],
    experience_details: [],
    skills: [],
    project_details: [],
    hobbies: [],
  });

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".color-menu-container")) setShowColorMenu(false);
      if (!target.closest(".template-menu-container")) setShowTemplateMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = () => {
      const personal = loadPersonalDetails();
      const education = loadEducationDetails();
      const experience = loadExperienceDetails();
      const projects = loadProjectDetails();
      const skillsRaw = loadSkills();
      const hobbiesRaw = loadHobbies();

      setData({
        personal_details: personal ? [personal] : [],
        education_details: education,
        experience_details: experience,
        project_details: projects,
        skills: skillsRaw.map((s: string, i: number) => ({ id: i, skill_name: s })),
        hobbies: hobbiesRaw.map((h: string, i: number) => ({ id: i, hobby_name: h })),
      });
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
      const element = pdfRef.current;
      const rect = element.getBoundingClientRect();
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: rect.width,
        height: rect.height,
        windowWidth: rect.width,
        windowHeight: rect.height,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let heightLeft = imgHeight * ratio;
      let position = 0;
      let pageCount = 0;

      pdf.addImage(imgData, "PNG", imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0 && pageCount < 5) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
        pageCount++;
      }

      const personal = data.personal_details[0];
      const fileName = personal
        ? `${personal.first_name}_${personal.last_name}_Resume.pdf`
        : "My_Resume.pdf";

      pdf.save(fileName);
      setPdfGenerated(true);
      setTimeout(() => setPdfGenerated(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => window.print();
  const handleEdit = () => router.push("/create-resume");
  const zoomIn = () => setPreviewScale((s) => Math.min(s + 0.1, 1.5));
  const zoomOut = () => setPreviewScale((s) => Math.max(s - 0.1, 0.5));

  const hasData = data.personal_details.length > 0 || data.education_details.length > 0;

  const TemplateComponent = selectedTemplate === "modern" ? ModernTemplate : ClassicTemplate;

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

            {/* Template Selector */}
            <div className="relative template-menu-container">
              <button
                onClick={() => { setShowTemplateMenu(!showTemplateMenu); setShowColorMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-500 transition-colors"
              >
                <LayoutTemplate className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{selectedTemplate}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTemplateMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showTemplateMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 min-w-[180px]"
                  >
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => { setSelectedTemplate(template.id); setShowTemplateMenu(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                          selectedTemplate === template.id ? "bg-teal-50 dark:bg-teal-500/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${selectedTemplate === template.id ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`} />
                        <div>
                          <span className={`text-sm font-medium block ${selectedTemplate === template.id ? "text-teal-700 dark:text-teal-300" : "text-gray-700 dark:text-gray-300"}`}>
                            {template.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{template.description}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Color Variant Selector */}
            <div className="relative color-menu-container">
              <button
                onClick={() => { setShowColorMenu(!showColorMenu); setShowTemplateMenu(false); }}
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
                          <div className={`w-4 h-4 rounded-full ${variant.color}`} />
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
            className="print:m-0 print:shadow-none"
            style={{ 
              transform: `scale(${previewScale})`, 
              transformOrigin: "top center", 
              transition: "transform 0.2s ease-out",
            }}
          >
            <div
              ref={pdfRef}
              className={`resume-paper resume-variant-${colorVariant} bg-white shadow-2xl print:shadow-none`}
              style={{ width: "210mm", minHeight: "297mm", boxSizing: "border-box" }}
            >
              <TemplateComponent
                personal_details={data.personal_details}
                education_details={data.education_details}
                experience_details={data.experience_details}
                skills={data.skills}
                project_details={data.project_details}
                hobbies={data.hobbies}
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
