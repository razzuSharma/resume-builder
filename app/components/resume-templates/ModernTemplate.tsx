"use client";

import React from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
} from "lucide-react";

interface ModernTemplateProps {
  personal_details: any[];
  education_details: any[];
  experience_details: any[];
  volunteer_details?: any[];
  skills: any[];
  project_details: any[];
  hobbies: any[];
  certifications?: any[];
  languages?: any[];
}

/**
 * Modern Resume Template
 * 
 * Fixed A4 Layout:
 * - Total width: 210mm
 * - Sidebar: 70mm (1/3)
 * - Main content: 140mm (2/3)
 * - Total height: 297mm minimum (A4)
 * 
 * Print-optimized with exact millimeter measurements
 */
const ModernTemplate: React.FC<ModernTemplateProps> = ({
  personal_details,
  education_details,
  experience_details,
  volunteer_details = [],
  skills,
  project_details,
  hobbies,
  certifications,
  languages,
}) => {
  const personal = personal_details[0] || {};

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const getSkills = () => {
    if (skills.length === 0) return [];
    try {
      if (skills.every((skill) => typeof skill === "string")) {
        return skills as string[];
      }
      const skillData = skills[0];
      if (typeof skillData?.skills === "string") return JSON.parse(skillData.skills);
      if (Array.isArray(skillData?.skills)) return skillData.skills;
      if (typeof skillData?.skill_name === "string") {
        return skills
          .map((skill: any) => skill?.skill_name)
          .filter((skill: unknown): skill is string => typeof skill === "string" && skill.trim().length > 0);
      }
      return [];
    } catch {
      return [];
    }
  };

  const getHobbies = () => {
    if (hobbies.length === 0) return [];
    try {
      if (hobbies.every((hobby) => typeof hobby === "string")) {
        return hobbies as string[];
      }
      const hobbyData = hobbies[0];
      if (typeof hobbyData?.hobbies === "string") return JSON.parse(hobbyData.hobbies);
      if (Array.isArray(hobbyData?.hobbies)) return hobbyData.hobbies;
      if (typeof hobbyData?.hobby_name === "string") {
        return hobbies
          .map((hobby: any) => hobby?.hobby_name)
          .filter((hobby: unknown): hobby is string => typeof hobby === "string" && hobby.trim().length > 0);
      }
      return [];
    } catch {
      return [];
    }
  };

  const skillList = getSkills();
  const hobbyList = getHobbies();

  return (
    <div 
      className="modern-resume"
      style={{
        // Exact A4 dimensions
        width: "210mm",
        minHeight: "297mm",
        
        // Font settings
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: "11pt",
        lineHeight: 1.4,
        
        // Ensure proper box model
        boxSizing: "border-box",
        
        // Background
        backgroundColor: "var(--resume-bg, #ffffff)",
        color: "var(--resume-text, #0f172a)",
      }}
    >
      {/* Main Layout: Sidebar + Content */}
      <div 
        className="flex"
        style={{ 
          width: "210mm",
          minHeight: "297mm",
        }}
      >
        {/* Left Sidebar - 70mm exact (1/3 of 210mm) */}
        <aside
          className="sidebar"
          style={{
            width: "70mm",
            minHeight: "297mm",
            background: `linear-gradient(180deg, var(--resume-accent, #0f766e) 0%, var(--resume-accent-dark, #115e59) 100%)`,
            color: "white",
            padding: "12mm 5mm 10mm 5mm",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          {/* Profile Image */}
          {personal.profile_image_url && (
            <div style={{ marginBottom: "6mm", textAlign: "center" }}>
              <div 
                style={{
                  width: "28mm",
                  height: "28mm",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.3)",
                  margin: "0 auto",
                }}
              >
                <Image
                  src={personal.profile_image_url}
                  alt={`${personal.first_name} ${personal.last_name}`}
                  width={106}
                  height={106}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}

          {/* Name */}
          <h1 style={{
            fontSize: "16pt",
            fontWeight: 700,
            marginBottom: "1mm",
            textAlign: "center",
            color: "white",
            lineHeight: 1.2,
          }}>
            {personal.first_name || "First"}
          </h1>
          <h1 style={{
            fontSize: "16pt",
            fontWeight: 700,
            marginBottom: "5mm",
            textAlign: "center",
            color: "white",
            lineHeight: 1.2,
          }}>
            {personal.last_name || "Last"}
          </h1>

          {/* Contact Info */}
          <div style={{ marginBottom: "6mm" }}>
            {personal.email && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "2mm",
                marginBottom: "2mm",
                fontSize: "9pt",
              }}>
                <Mail style={{ width: "3.5mm", height: "3.5mm", flexShrink: 0, opacity: 0.8 }} />
                <span style={{ wordBreak: "break-all", opacity: 0.9 }}>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "2mm",
                marginBottom: "2mm",
                fontSize: "9pt",
              }}>
                <Phone style={{ width: "3.5mm", height: "3.5mm", flexShrink: 0, opacity: 0.8 }} />
                <span style={{ opacity: 0.9 }}>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "2mm",
                marginBottom: "2mm",
                fontSize: "9pt",
              }}>
                <MapPin style={{ width: "3.5mm", height: "3.5mm", flexShrink: 0, opacity: 0.8 }} />
                <span style={{ opacity: 0.9 }}>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "2mm",
                marginBottom: "2mm",
                fontSize: "9pt",
              }}>
                <Linkedin style={{ width: "3.5mm", height: "3.5mm", flexShrink: 0, opacity: 0.8 }} />
                <span style={{ wordBreak: "break-all", opacity: 0.9 }}>{personal.linkedin}</span>
              </div>
            )}
            {personal.github && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "2mm",
                marginBottom: "2mm",
                fontSize: "9pt",
              }}>
                <Github style={{ width: "3.5mm", height: "3.5mm", flexShrink: 0, opacity: 0.8 }} />
                <span style={{ wordBreak: "break-all", opacity: 0.9 }}>{personal.github}</span>
              </div>
            )}
            {personal.website && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "2mm",
                fontSize: "9pt",
              }}>
                <Globe style={{ width: "3.5mm", height: "3.5mm", flexShrink: 0, opacity: 0.8 }} />
                <span style={{ wordBreak: "break-all", opacity: 0.9 }}>{personal.website}</span>
              </div>
            )}
          </div>

          {/* Skills Section */}
          {skillList.length > 0 && (
            <div style={{ marginBottom: "6mm" }}>
              <h2 style={{
                fontSize: "10pt",
                fontWeight: 700,
                marginBottom: "3mm",
                paddingBottom: "1.5mm",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}>
                Skills
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5mm" }}>
                {skillList.map((skill: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      padding: "1mm 2.5mm",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "2mm",
                      fontSize: "8.5pt",
                      color: "white",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div style={{ marginBottom: "6mm" }}>
              <h2 style={{
                fontSize: "10pt",
                fontWeight: 700,
                marginBottom: "3mm",
                paddingBottom: "1.5mm",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}>
                Languages
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5mm" }}>
                {languages.map((lang, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      fontSize: "9pt",
                    }}
                  >
                    <span style={{ opacity: 0.9 }}>{lang.language}</span>
                    <span style={{ opacity: 0.7 }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {hobbyList.length > 0 && (
            <div>
              <h2 style={{
                fontSize: "10pt",
                fontWeight: 700,
                marginBottom: "3mm",
                paddingBottom: "1.5mm",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}>
                Interests
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5mm" }}>
                {hobbyList.map((hobby: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      padding: "1mm 2.5mm",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "2mm",
                      fontSize: "8.5pt",
                      color: "white",
                    }}
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content - 140mm exact (2/3 of 210mm) */}
        <main
          style={{
            width: "140mm",
            minHeight: "297mm",
            padding: "12mm 6mm 10mm 6mm",
            boxSizing: "border-box",
            backgroundColor: "var(--resume-bg, #ffffff)",
            flexShrink: 0,
          }}
        >
          {/* Summary */}
          {personal.summary && (
            <section style={{ marginBottom: "6mm" }}>
              <h2 style={{
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "3mm",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--resume-accent, #0f766e)",
              }}>
                Profile
              </h2>
              <p style={{
                fontSize: "10pt",
                lineHeight: 1.5,
                color: "var(--resume-text-muted, #475569)",
                textAlign: "justify",
              }}>
                {personal.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience_details.length > 0 && (
            <section style={{ marginBottom: "6mm" }}>
              <h2 style={{
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "3mm",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--resume-accent, #0f766e)",
              }}>
                Experience
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "4mm" }}>
                {experience_details.map((exp, index) => (
                  <div key={index}>
                    <h3 style={{
                      fontSize: "10.5pt",
                      fontWeight: 700,
                      marginBottom: "0.5mm",
                      color: "var(--resume-text, #0f172a)",
                    }}>
                      {exp.position}
                    </h3>
                    <p style={{
                      fontSize: "10pt",
                      fontWeight: 600,
                      marginBottom: "0.5mm",
                      color: "var(--resume-accent, #0f766e)",
                    }}>
                      {exp.company_name}
                    </p>
                    <p style={{
                      fontSize: "9pt",
                      marginBottom: "1.5mm",
                      color: "var(--resume-text-muted, #475569)",
                    }}>
                      {formatDate(exp.start_date)} - {exp.present ? "Present" : formatDate(exp.end_date)}
                      {exp.location && ` | ${exp.location}`}
                    </p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul style={{
                        margin: 0,
                        paddingLeft: "4mm",
                        fontSize: "9.5pt",
                        lineHeight: 1.5,
                        color: "var(--resume-text-muted, #475569)",
                      }}>
                        {exp.responsibilities.map((resp: string, i: number) =>
                          resp ? <li key={i} style={{ marginBottom: "0.5mm" }}>{resp}</li> : null
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Volunteer Experience */}
          {volunteer_details.length > 0 && (
            <section style={{ marginBottom: "6mm" }}>
              <h2 style={{
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "3mm",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--resume-accent, #0f766e)",
              }}>
                Volunteer Experience
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "4mm" }}>
                {volunteer_details.map((volunteer, index) => (
                  <div key={index}>
                    <h3 style={{
                      fontSize: "10.5pt",
                      fontWeight: 700,
                      marginBottom: "0.5mm",
                      color: "var(--resume-text, #0f172a)",
                    }}>
                      {volunteer.role}
                    </h3>
                    <p style={{
                      fontSize: "10pt",
                      fontWeight: 600,
                      marginBottom: "0.5mm",
                      color: "var(--resume-accent, #0f766e)",
                    }}>
                      {volunteer.organization_name}
                    </p>
                    <p style={{
                      fontSize: "9pt",
                      marginBottom: "1.5mm",
                      color: "var(--resume-text-muted, #475569)",
                    }}>
                      {formatDate(volunteer.start_date)} - {volunteer.present ? "Present" : formatDate(volunteer.end_date)}
                      {volunteer.location && ` | ${volunteer.location}`}
                    </p>
                    {volunteer.contributions && volunteer.contributions.length > 0 && (
                      <ul style={{
                        margin: 0,
                        paddingLeft: "4mm",
                        fontSize: "9.5pt",
                        lineHeight: 1.5,
                        color: "var(--resume-text-muted, #475569)",
                      }}>
                        {volunteer.contributions.map((item: string, i: number) =>
                          item ? <li key={i} style={{ marginBottom: "0.5mm" }}>{item}</li> : null
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education_details.length > 0 && (
            <section style={{ marginBottom: "6mm" }}>
              <h2 style={{
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "3mm",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--resume-accent, #0f766e)",
              }}>
                Education
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "3mm" }}>
                {education_details.map((edu, index) => (
                  <div key={index}>
                    <h3 style={{
                      fontSize: "10.5pt",
                      fontWeight: 700,
                      marginBottom: "0.5mm",
                      color: "var(--resume-text, #0f172a)",
                    }}>
                      {edu.degree}
                    </h3>
                    <p style={{
                      fontSize: "10pt",
                      fontWeight: 600,
                      color: "var(--resume-accent, #0f766e)",
                    }}>
                      {edu.school_name}
                    </p>
                    <p style={{
                      fontSize: "9pt",
                      color: "var(--resume-text-muted, #475569)",
                    }}>
                      {edu.field_of_study}
                    </p>
                    <p style={{
                      fontSize: "9pt",
                      color: "var(--resume-text-muted, #475569)",
                    }}>
                      {formatDate(edu.start_date)} - {edu.present ? "Present" : formatDate(edu.end_date)}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Samples */}
          {project_details.length > 0 && (
            <section style={{ marginBottom: "6mm" }}>
              <h2 style={{
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "3mm",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--resume-accent, #0f766e)",
              }}>
                Work Samples
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "3mm" }}>
                {project_details.map((project, index) => (
                  <div key={index}>
                    <h3 style={{
                      fontSize: "10.5pt",
                      fontWeight: 700,
                      marginBottom: "0.5mm",
                      color: "var(--resume-text, #0f172a)",
                    }}>
                      {project.name || project.title}
                    </h3>
                    <p style={{
                      fontSize: "9pt",
                      marginBottom: "1mm",
                      color: "var(--resume-text-muted, #475569)",
                    }}>
                      {formatDate(project.start_date)} - {project.present ? "Present" : formatDate(project.end_date)}
                    </p>
                    {(project.role || project.your_role) && (
                      <p style={{
                        fontSize: "9pt",
                        marginBottom: "1mm",
                        color: "var(--resume-accent, #0f766e)",
                      }}>
                        <strong>Role:</strong> {project.role || project.your_role}
                      </p>
                    )}
                    {project.description && (
                      <p style={{
                        fontSize: "9.5pt",
                        lineHeight: 1.5,
                        color: "var(--resume-text-muted, #475569)",
                      }}>
                        {project.description}
                      </p>
                    )}
                    {(project.outcome || project.result) && (
                      <p style={{
                        fontSize: "9pt",
                        marginTop: "0.8mm",
                        color: "var(--resume-accent, #0f766e)",
                      }}>
                        <strong>Outcome:</strong> {project.outcome || project.result}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <p style={{
                        fontSize: "9pt",
                        marginTop: "0.8mm",
                        color: "var(--resume-text-muted, #475569)",
                      }}>
                        <strong>Tools/Skills:</strong> {project.technologies.join(" • ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h2 style={{
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "3mm",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--resume-accent, #0f766e)",
              }}>
                Certifications
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "3mm" }}>
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 style={{
                      fontSize: "10.5pt",
                      fontWeight: 700,
                      marginBottom: "0.5mm",
                      color: "var(--resume-text, #0f172a)",
                    }}>
                      {cert.name}
                    </h3>
                    <p style={{
                      fontSize: "10pt",
                      color: "var(--resume-accent, #0f766e)",
                    }}>
                      {cert.issuing_organization}
                    </p>
                    <p style={{
                      fontSize: "9pt",
                      color: "var(--resume-text-muted, #475569)",
                    }}>
                      {formatDate(cert.issue_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModernTemplate;
