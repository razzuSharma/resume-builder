"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Edit3,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Printer,
  CheckCircle2,
  LayoutTemplate,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllData } from "../redux/features/dataSlice";
import ResumeLayout from "../components/ResumeLayout";
import ModernTemplate from "../components/resume-templates/ModernTemplate";

type TemplateType = "classic" | "modern";

const templates: { id: TemplateType; name: string; description: string }[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column layout with clean typography",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with sidebar and gradient accents",
  },
];

const ResumePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("classic");
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  const {
    personal_details,
    education_details,
    experience_details,
    skills,
    project_details,
    hobbies,
    certifications,
    languages,
    loading,
    error,
  } = useAppSelector((state) => state.data);

  useEffect(() => {
    const uniqueIdentifier = localStorage.getItem("user_id");
    if (uniqueIdentifier) {
      dispatch(fetchAllData(uniqueIdentifier));
    }
  }, [dispatch]);

  const generatePDF = async () => {
    if (!pdfRef.current) return;

    setIsGeneratingPDF(true);
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let imgY = 0;

      // Handle multi-page PDFs
      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          position,
          imgWidth * ratio,
          imgHeight * ratio
        );
        heightLeft -= pdfHeight;
      }

      const personal = personal_details[0];
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

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    router.push("/create-resume");
  };

  const hasData =
    personal_details.length > 0 ||
    education_details.length > 0 ||
    experience_details.length > 0 ||
    skills.length > 0 ||
    project_details.length > 0 ||
    hobbies.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load Resume
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/create-resume")}
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Create Resume
          </button>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Resume Data Found
          </h2>
          <p className="text-gray-600 mb-8">
            You haven&apos;t created a resume yet. Start building your professional
            resume now!
          </p>
          <button
            onClick={() => router.push("/create-resume")}
            className="inline-flex items-center gap-2 px-8 py-4 text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Create Your Resume
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header (not part of the print-ready page) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="no-print flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Your Resume
            </h1>
            <p className="text-gray-600">
              Preview and download your professional resume
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Template Selector */}
            <div className="relative">
              <button
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <LayoutTemplate className="w-4 h-4" />
                {templates.find((t) => t.id === selectedTemplate)?.name}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showTemplateMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setShowTemplateMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                        selectedTemplate === template.id
                          ? "bg-teal-50 text-teal-700"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-500">
                        {template.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Resume
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>

            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className={`inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-xl transition-all shadow-lg ${
                pdfGenerated
                  ? "bg-green-600 shadow-green-500/25"
                  : "bg-gradient-to-r from-teal-600 to-cyan-600 shadow-teal-500/25 hover:from-teal-700 hover:to-cyan-700"
              } disabled:opacity-70`}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : pdfGenerated ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-transparent rounded-2xl p-4 sm:p-8"
        >
          {/* Paper */}
          <div
            ref={pdfRef}
            className="resume-paper bg-white w-[210mm] mx-auto shadow-lg print:shadow-none"
            style={{ minHeight: "297mm" }}
          >
            {selectedTemplate === "classic" ? (
              <ResumeLayout
                personal_details={personal_details}
                education_details={education_details}
                experience_details={experience_details}
                skills={skills}
                project_details={project_details}
                hobbies={hobbies}
                certifications={certifications}
                languages={languages}
              />
            ) : (
              <ModernTemplate
                personal_details={personal_details}
                education_details={education_details}
                experience_details={experience_details}
                skills={skills}
                project_details={project_details}
                hobbies={hobbies}
                certifications={certifications}
                languages={languages}
              />
            )}
          </div>
        </motion.div>

        {/* Tips (not part of the print-ready page) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="no-print mt-8 grid sm:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Choose Template</h3>
            <p className="text-sm text-gray-600">
              Switch between Classic and Modern layouts
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <Edit3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Edit Anytime</h3>
            <p className="text-sm text-gray-600">
              Click Edit to modify your information
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">ATS Friendly</h3>
            <p className="text-sm text-gray-600">
              Your resume is optimized for applicant tracking systems
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumePage;
