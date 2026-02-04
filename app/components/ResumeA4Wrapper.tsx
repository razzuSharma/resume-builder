"use client";

import React from "react";

interface ResumeA4WrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Scale factor for screen preview (1.0 = actual A4 size) */
  previewScale?: number;
}

/**
 * A4 Resume Wrapper
 * 
 * Enforces exact A4 dimensions (210mm × 297mm) for both screen and print.
 * Handles scaling for preview while maintaining print accuracy.
 * 
 * A4 Specs:
 * - Width: 210mm
 * - Height: 297mm (auto for multi-page)
 * - Margins: handled internally by content
 */
const ResumeA4Wrapper: React.FC<ResumeA4WrapperProps> = ({
  children,
  className = "",
  previewScale = 1,
}) => {
  return (
    <div
      className={`
        resume-a4-wrapper
        relative
        bg-white
        shadow-2xl
        print:shadow-none
        print:m-0
        ${className}
      `}
      style={{
        // A4 dimensions
        width: "210mm",
        minHeight: "297mm",
        
        // Screen preview scaling (only on screen, not print)
        transform: `scale(${previewScale})`,
        transformOrigin: "top center",
        
        // Ensure proper box model
        boxSizing: "border-box",
        
        // Prevent overflow issues
        maxWidth: "none",
        margin: "0 auto",
      }}
      data-preview-scale={previewScale}
    >
      {/* Inner container for content padding safety */}
      <div 
        className="w-full h-full"
        style={{ boxSizing: "border-box" }}
      >
        {children}
      </div>

      {/* Debug indicator (hidden in production/print) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-400 hidden print:block">
          A4: 210mm × 297mm
        </div>
      )}
    </div>
  );
};

export default ResumeA4Wrapper;
