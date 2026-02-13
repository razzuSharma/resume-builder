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

interface ClassicTemplateProps {
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

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
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
      className="classic-resume"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        fontSize: "11pt",
        lineHeight: 1.5,
        boxSizing: "border-box",
        backgroundColor: "var(--resume-bg, #ffffff)",
        color: "var(--resume-text, #0f172a)",
        padding: "15mm 18mm",
      }}
    >
      {/* Header Section */}
      <header style={{ textAlign: "center", marginBottom: "6mm" }}>
        {personal.profile_image_url && (
          <div style={{ marginBottom: "4mm" }}>
            <div 
              style={{
                width: "28mm",
                height: "28mm",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid var(--resume-accent, #334155)",
                margin: "0 auto",
              }}
            >
              <Image
                src={personal.profile_image_url}
                alt={`${personal.first_name} ${personal.last_name}`}
                width={106}
                height={106}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        <h1 style={{
          fontSize: "24pt",
          fontWeight: 700,
          marginBottom: "2mm",
          color: "var(--resume-accent, #334155)",
          letterSpacing: "0.05em",
        }}>
          {personal.first_name} {personal.last_name}
        </h1>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "3mm",
          fontSize: "9.5pt",
          color: "var(--resume-text-muted, #475569)",
          marginBottom: "3mm",
        }}>
          {personal.email && (
            <span><Mail style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.email}</span>
          )}
          {personal.phone && (
            <span><Phone style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.phone}</span>
          )}
          {personal.location && (
            <span><MapPin style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.location}</span>
          )}
        </div>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4mm",
          fontSize: "9pt",
        }}>
          {personal.linkedin && (
            <span style={{ color: "var(--resume-text-muted, #475569)" }}>
              <Linkedin style={{ width: "3mm", height: "3mm", display: "inline", verticalAlign: "middle" }} /> {personal.linkedin}
            </span>
          )}
          {personal.github && (
            <span style={{ color: "var(--resume-text-muted, #475569)" }}>
              <Github style={{ width: "3mm", height: "3mm", display: "inline", verticalAlign: "middle" }} /> {personal.github}
            </span>
          )}
          {personal.website && (
            <span style={{ color: "var(--resume-text-muted, #475569)" }}>
              <Globe style={{ width: "3mm", height: "3mm", display: "inline", verticalAlign: "middle" }} /> {personal.website}
            </span>
          )}
        </div>

        <div style={{
          height: "1px",
          backgroundColor: "var(--resume-accent, #334155)",
          marginTop: "5mm",
        }} />
      </header>

      {/* Summary */}
      {personal.summary && (
        <section style={{ marginBottom: "5mm" }}>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "2mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Professional Summary
          </h2>
          <p style={{ fontSize: "10.5pt", color: "var(--resume-text-muted, #475569)" }}>
            {personal.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience_details.length > 0 && (
        <section style={{ marginBottom: "5mm" }}>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "3mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Work Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4mm" }}>
            {experience_details.map((exp, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "11pt", fontWeight: 700 }}>{exp.position}</h3>
                  <span style={{ fontSize: "9.5pt", color: "var(--resume-text-muted, #475569)", fontStyle: "italic" }}>
                    {formatDate(exp.start_date)} - {exp.present ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p style={{ fontSize: "10.5pt", fontWeight: 600, color: "var(--resume-accent, #334155)" }}>
                  {exp.company_name}{exp.location && ` • ${exp.location}`}
                </p>
                {exp.responsibilities && (
                  <ul style={{ margin: 0, paddingLeft: "5mm", fontSize: "10pt", color: "var(--resume-text-muted, #475569)" }}>
                    {exp.responsibilities.map((resp: string, i: number) => resp ? <li key={i}>{resp}</li> : null)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer Experience */}
      {volunteer_details.length > 0 && (
        <section style={{ marginBottom: "5mm" }}>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "3mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Volunteer Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4mm" }}>
            {volunteer_details.map((volunteer, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "11pt", fontWeight: 700 }}>{volunteer.role}</h3>
                  <span style={{ fontSize: "9.5pt", color: "var(--resume-text-muted, #475569)", fontStyle: "italic" }}>
                    {formatDate(volunteer.start_date)} - {volunteer.present ? "Present" : formatDate(volunteer.end_date)}
                  </span>
                </div>
                <p style={{ fontSize: "10.5pt", fontWeight: 600, color: "var(--resume-accent, #334155)" }}>
                  {volunteer.organization_name}{volunteer.location && ` • ${volunteer.location}`}
                </p>
                {volunteer.contributions && (
                  <ul style={{ margin: 0, paddingLeft: "5mm", fontSize: "10pt", color: "var(--resume-text-muted, #475569)" }}>
                    {volunteer.contributions.map((item: string, i: number) => item ? <li key={i}>{item}</li> : null)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education_details.length > 0 && (
        <section style={{ marginBottom: "5mm" }}>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "3mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Education
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "3mm" }}>
            {education_details.map((edu, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "11pt", fontWeight: 700 }}>{edu.degree}</h3>
                  <span style={{ fontSize: "9.5pt", color: "var(--resume-text-muted, #475569)", fontStyle: "italic" }}>
                    {formatDate(edu.start_date)} - {edu.present ? "Present" : formatDate(edu.end_date)}
                  </span>
                </div>
                <p style={{ fontSize: "10.5pt", color: "var(--resume-accent, #334155)" }}>{edu.school_name}</p>
                <p style={{ fontSize: "10pt", color: "var(--resume-text-muted, #475569)" }}>
                  {edu.field_of_study}{edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section style={{ marginBottom: "5mm" }}>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "2mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Skills
          </h2>
          <p style={{ fontSize: "10.5pt", color: "var(--resume-text-muted, #475569)" }}>
            {skillList.join(" • ")}
          </p>
        </section>
      )}

      {/* Work Samples */}
      {project_details.length > 0 && (
        <section style={{ marginBottom: "5mm" }}>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "3mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Work Samples
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "3mm" }}>
            {project_details.map((project, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "11pt", fontWeight: 700 }}>{project.name || project.title}</h3>
                  <span style={{ fontSize: "9.5pt", color: "var(--resume-text-muted, #475569)", fontStyle: "italic" }}>
                    {formatDate(project.start_date)} - {project.present ? "Present" : formatDate(project.end_date)}
                  </span>
                </div>
                {(project.role || project.your_role) && (
                  <p style={{ fontSize: "9.5pt", color: "var(--resume-accent, #334155)" }}>
                    <strong>Role:</strong> {project.role || project.your_role}
                  </p>
                )}
                {project.description && (
                  <p style={{ fontSize: "10pt", color: "var(--resume-text-muted, #475569)" }}>{project.description}</p>
                )}
                {(project.outcome || project.result) && (
                  <p style={{ fontSize: "9.5pt", color: "var(--resume-accent, #334155)" }}>
                    <strong>Outcome:</strong> {project.outcome || project.result}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p style={{ fontSize: "9.5pt", color: "var(--resume-text-muted, #475569)" }}>
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
        <section style={{ marginBottom: "5mm" }}>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "3mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Certifications
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2mm" }}>
            {certifications.map((cert, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10.5pt", fontWeight: 600 }}>{cert.name}</span>
                <span style={{ fontSize: "9.5pt", color: "var(--resume-text-muted, #475569)", fontStyle: "italic" }}>
                  {formatDate(cert.issue_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hobbies */}
      {hobbyList.length > 0 && (
        <section>
          <h2 style={{
            fontSize: "12pt",
            fontWeight: 700,
            color: "var(--resume-accent, #334155)",
            borderBottom: "1px solid var(--resume-border, #e2e8f0)",
            paddingBottom: "1.5mm",
            marginBottom: "2mm",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Interests
          </h2>
          <p style={{ fontSize: "10.5pt", color: "var(--resume-text-muted, #475569)" }}>
            {hobbyList.join(" • ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
