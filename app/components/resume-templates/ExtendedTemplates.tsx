"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";
import type { TemplateId } from "../../lib/templates";

export interface ResumeTemplateProps {
  personal_details: any[];
  education_details: any[];
  experience_details: any[];
  volunteer_details?: any[];
  skills: any[];
  project_details: any[];
  hobbies: any[];
  certifications?: any[];
  languages?: any[];
  variant?: TemplateId;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const readStringList = (items: any[], key: "skill_name" | "hobby_name") => {
  if (!Array.isArray(items) || items.length === 0) return [] as string[];
  if (items.every((item) => typeof item === "string")) {
    return items.filter((item): item is string => !!item && item.trim().length > 0);
  }

  return items
    .map((item: any) => {
      if (typeof item?.[key] === "string") return item[key];
      if (key === "skill_name") {
        if (Array.isArray(item?.skills)) return item.skills.join(" • ");
        if (typeof item?.skills === "string") return item.skills;
      }
      if (key === "hobby_name") {
        if (Array.isArray(item?.hobbies)) return item.hobbies.join(" • ");
        if (typeof item?.hobbies === "string") return item.hobbies;
      }
      return "";
    })
    .join(" • ")
    .split("•")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const splitProjects = (projects: any[]) => {
  if (!Array.isArray(projects) || projects.length === 0) return [] as any[];
  return projects.map((project) => ({
    title: project.name || project.title || "Project",
    role: project.role || project.your_role || "",
    description: project.description || "",
    outcome: project.outcome || project.result || "",
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === "string"
      ? project.technologies.split(",").map((item: string) => item.trim()).filter(Boolean)
      : [],
    date: `${formatDate(project.start_date)}${project.start_date || project.end_date ? " - " : ""}${project.present ? "Present" : formatDate(project.end_date)}`,
  }));
};

export const CompactTemplate: React.FC<ResumeTemplateProps> = ({
  personal_details,
  education_details,
  experience_details,
  volunteer_details = [],
  skills,
  project_details,
  hobbies,
}) => {
  const personal = personal_details[0] || {};
  const skillList = readStringList(skills, "skill_name");
  const hobbyList = readStringList(hobbies, "hobby_name");
  const projects = splitProjects(project_details);

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        padding: "11mm 12mm",
        fontFamily: '"Arial Narrow", Arial, Helvetica, sans-serif',
        fontSize: "9.8pt",
        lineHeight: 1.35,
        color: "var(--resume-text, #0f172a)",
        background: "#fff",
      }}
    >
      <div style={{ height: "5mm", background: "var(--resume-accent, #0f766e)", margin: "-11mm -12mm 4mm -12mm" }} />

      <header style={{ marginBottom: "3mm" }}>
        <h1 style={{ margin: 0, fontSize: "21pt", fontWeight: 800, letterSpacing: "0.03em", color: "var(--resume-text, #0f172a)" }}>
          {personal.first_name || "Your"} {personal.last_name || "Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5mm", marginTop: "1.5mm", color: "var(--resume-text-muted, #475569)", fontSize: "8.7pt" }}>
          {personal.email && <span><Mail style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.email}</span>}
          {personal.phone && <span><Phone style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.phone}</span>}
          {personal.location && <span><MapPin style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.location}</span>}
          {personal.linkedin && <span><Linkedin style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.linkedin}</span>}
          {personal.github && <span><Github style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.github}</span>}
          {personal.website && <span><Globe style={{ width: "3mm", height: "3mm", display: "inline" }} /> {personal.website}</span>}
        </div>
      </header>

      {personal.summary && (
        <section style={{ marginBottom: "3.5mm" }}>
          <h2 style={{ margin: 0, fontSize: "10.5pt", color: "var(--resume-accent, #0f766e)", borderBottom: "1px solid var(--resume-border, #e2e8f0)", letterSpacing: "0.05em" }}>PROFILE</h2>
          <p style={{ margin: "1.2mm 0 0", color: "var(--resume-text-muted, #475569)" }}>{personal.summary}</p>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4mm" }}>
        <div>
          {experience_details.length > 0 && (
            <section style={{ marginBottom: "4mm" }}>
              <h2 style={{ margin: 0, fontSize: "10.5pt", color: "var(--resume-accent, #0f766e)", borderBottom: "1px solid var(--resume-border, #e2e8f0)", letterSpacing: "0.05em" }}>EXPERIENCE</h2>
              {experience_details.slice(0, 5).map((exp, index) => (
                <div key={index} style={{ marginTop: "2mm" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "2mm" }}>
                    <strong>{exp.position || "Role"}</strong>
                    <span style={{ fontSize: "8.5pt", color: "var(--resume-text-muted, #475569)" }}>
                      {formatDate(exp.start_date)} - {exp.present ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p style={{ margin: "0.6mm 0", color: "var(--resume-accent-dark, #115e59)", fontSize: "9pt" }}>{exp.company_name}</p>
                  {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: "4mm" }}>
                      {exp.responsibilities.slice(0, 3).map((item: string, i: number) => item ? <li key={i}>{item}</li> : null)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {volunteer_details.length > 0 && (
            <section style={{ marginBottom: "4mm" }}>
              <h2 style={{ margin: 0, fontSize: "10.5pt", color: "var(--resume-accent, #0f766e)", borderBottom: "1px solid var(--resume-border, #e2e8f0)", letterSpacing: "0.05em" }}>VOLUNTEER</h2>
              {volunteer_details.slice(0, 3).map((vol, index) => (
                <div key={index} style={{ marginTop: "2mm" }}>
                  <strong>{vol.role || "Volunteer Role"}</strong>
                  <p style={{ margin: "0.6mm 0", color: "var(--resume-accent-dark, #115e59)", fontSize: "9pt" }}>{vol.organization_name}</p>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 style={{ margin: 0, fontSize: "10.5pt", color: "var(--resume-accent, #0f766e)", borderBottom: "1px solid var(--resume-border, #e2e8f0)", letterSpacing: "0.05em" }}>PROJECTS</h2>
              {projects.slice(0, 2).map((project, index) => (
                <div key={index} style={{ marginTop: "2mm" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "2mm" }}>
                    <strong>{project.title}</strong>
                    <span style={{ fontSize: "8.5pt", color: "var(--resume-text-muted, #475569)" }}>{project.date}</span>
                  </div>
                  {project.description && <p style={{ margin: "0.7mm 0", color: "var(--resume-text-muted, #475569)" }}>{project.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        <div>
          {education_details.length > 0 && (
            <section style={{ marginBottom: "4mm" }}>
              <h2 style={{ margin: 0, fontSize: "10.5pt", color: "var(--resume-accent, #0f766e)", borderBottom: "1px solid var(--resume-border, #e2e8f0)", letterSpacing: "0.05em" }}>EDUCATION</h2>
              {education_details.slice(0, 3).map((edu, index) => (
                <div key={index} style={{ marginTop: "2mm" }}>
                  <strong>{edu.degree}</strong>
                  <p style={{ margin: "0.4mm 0", color: "var(--resume-accent-dark, #115e59)", fontSize: "9pt" }}>{edu.school_name}</p>
                  <p style={{ margin: 0, color: "var(--resume-text-muted, #475569)", fontSize: "8.4pt" }}>
                    {formatDate(edu.start_date)} - {edu.present ? "Present" : formatDate(edu.end_date)}
                  </p>
                </div>
              ))}
            </section>
          )}

          {skillList.length > 0 && (
            <section style={{ marginBottom: "4mm" }}>
              <h2 style={{ margin: 0, fontSize: "10.5pt", color: "var(--resume-accent, #0f766e)", borderBottom: "1px solid var(--resume-border, #e2e8f0)", letterSpacing: "0.05em" }}>SKILLS</h2>
              <div style={{ marginTop: "1.5mm", display: "flex", flexWrap: "wrap", gap: "1mm" }}>
                {skillList.slice(0, 16).map((skill, index) => (
                  <span key={index} style={{ border: "1px solid var(--resume-accent-light, #14b8a6)", borderRadius: "2mm", padding: "0.5mm 1.5mm", fontSize: "8.4pt", color: "var(--resume-accent-dark, #115e59)" }}>{skill}</span>
                ))}
              </div>
            </section>
          )}

          {hobbyList.length > 0 && (
            <section>
              <h2 style={{ margin: 0, fontSize: "10.5pt", color: "var(--resume-accent, #0f766e)", borderBottom: "1px solid var(--resume-border, #e2e8f0)", letterSpacing: "0.05em" }}>INTERESTS</h2>
              <p style={{ margin: "1.5mm 0 0", color: "var(--resume-text-muted, #475569)" }}>{hobbyList.slice(0, 8).join(" • ")}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const MinimalTemplate: React.FC<ResumeTemplateProps> = ({
  personal_details,
  education_details,
  experience_details,
  volunteer_details = [],
  skills,
  project_details,
  hobbies,
}) => {
  const personal = personal_details[0] || {};
  const skillList = readStringList(skills, "skill_name");
  const hobbyList = readStringList(hobbies, "hobby_name");
  const projects = splitProjects(project_details);

  const sectionTitle = (title: string) => (
    <h2 style={{ margin: "0 0 2mm", fontSize: "10.5pt", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--resume-accent, #0f766e)" }}>{title}</h2>
  );

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        padding: "16mm 18mm",
        fontFamily: '"Garamond", "Times New Roman", serif',
        fontSize: "11pt",
        lineHeight: 1.45,
        color: "var(--resume-text, #0f172a)",
        background: "#fff",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "8mm" }}>
        <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 700, letterSpacing: "0.03em" }}>
          {personal.first_name || "Your"} {personal.last_name || "Name"}
        </h1>
        <div style={{ marginTop: "2mm", color: "var(--resume-text-muted, #475569)", fontSize: "9.5pt" }}>
          {[personal.email, personal.phone, personal.location].filter(Boolean).join("  •  ")}
        </div>
        <div style={{ marginTop: "1.5mm", color: "var(--resume-text-muted, #475569)", fontSize: "9pt" }}>
          {[personal.linkedin, personal.github, personal.website].filter(Boolean).join("  •  ")}
        </div>
      </header>

      {personal.summary && (
        <section style={{ marginBottom: "6mm" }}>
          {sectionTitle("Professional Summary")}
          <p style={{ margin: 0, color: "var(--resume-text-muted, #475569)" }}>{personal.summary}</p>
        </section>
      )}

      {experience_details.length > 0 && (
        <section style={{ marginBottom: "6mm" }}>
          {sectionTitle("Experience")}
          {experience_details.map((exp, index) => (
            <div key={index} style={{ marginBottom: "3mm" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "3mm" }}>
                <strong>{exp.position}</strong>
                <span style={{ color: "var(--resume-text-muted, #475569)", fontSize: "9.2pt" }}>{formatDate(exp.start_date)} - {exp.present ? "Present" : formatDate(exp.end_date)}</span>
              </div>
              <p style={{ margin: "0.8mm 0", color: "var(--resume-accent, #0f766e)" }}>{exp.company_name}{exp.location ? ` • ${exp.location}` : ""}</p>
              {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: "5mm", color: "var(--resume-text-muted, #475569)" }}>
                  {exp.responsibilities.slice(0, 4).map((item: string, i: number) => item ? <li key={i}>{item}</li> : null)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {volunteer_details.length > 0 && (
        <section style={{ marginBottom: "6mm" }}>
          {sectionTitle("Volunteer")}
          {volunteer_details.map((vol, index) => (
            <p key={index} style={{ margin: "0 0 1.4mm", color: "var(--resume-text-muted, #475569)" }}>
              <strong>{vol.role}</strong> - {vol.organization_name}
            </p>
          ))}
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6mm" }}>
        {education_details.length > 0 && (
          <section>
            {sectionTitle("Education")}
            {education_details.map((edu, index) => (
              <div key={index} style={{ marginBottom: "2mm" }}>
                <strong>{edu.degree}</strong>
                <p style={{ margin: "0.5mm 0", color: "var(--resume-text-muted, #475569)" }}>{edu.school_name}</p>
                <p style={{ margin: 0, color: "var(--resume-text-muted, #475569)", fontSize: "9pt" }}>{formatDate(edu.start_date)} - {edu.present ? "Present" : formatDate(edu.end_date)}</p>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            {sectionTitle("Work Samples")}
            {projects.slice(0, 3).map((project, index) => (
              <div key={index} style={{ marginBottom: "2mm" }}>
                <strong>{project.title}</strong>
                {project.description && <p style={{ margin: "0.5mm 0", color: "var(--resume-text-muted, #475569)" }}>{project.description}</p>}
              </div>
            ))}
          </section>
        )}
      </div>

      {(skillList.length > 0 || hobbyList.length > 0) && (
        <section style={{ marginTop: "6mm" }}>
          {sectionTitle("Skills & Interests")}
          {skillList.length > 0 && <p style={{ margin: "0 0 1mm", color: "var(--resume-text-muted, #475569)" }}><strong>Skills:</strong> {skillList.join(" • ")}</p>}
          {hobbyList.length > 0 && <p style={{ margin: 0, color: "var(--resume-text-muted, #475569)" }}><strong>Interests:</strong> {hobbyList.join(" • ")}</p>}
        </section>
      )}
    </div>
  );
};

export const ExecutiveTemplate: React.FC<ResumeTemplateProps> = ({
  personal_details,
  education_details,
  experience_details,
  volunteer_details = [],
  skills,
  project_details,
  hobbies,
}) => {
  const personal = personal_details[0] || {};
  const skillList = readStringList(skills, "skill_name");
  const hobbyList = readStringList(hobbies, "hobby_name");
  const projects = splitProjects(project_details);

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        padding: "12mm 14mm",
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: "10.4pt",
        lineHeight: 1.4,
        color: "var(--resume-text, #0f172a)",
        background: "#fff",
      }}
    >
      <header style={{ borderBottom: "2px solid var(--resume-accent-dark, #115e59)", paddingBottom: "3mm", marginBottom: "4mm" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "4mm", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24pt", fontWeight: 800, letterSpacing: "0.02em" }}>
              {personal.first_name || "Your"} {personal.last_name || "Name"}
            </h1>
            <p style={{ margin: "1mm 0 0", color: "var(--resume-text-muted, #475569)" }}>{personal.location || ""}</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "9pt", color: "var(--resume-text-muted, #475569)" }}>
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.linkedin && <div>{personal.linkedin}</div>}
            {personal.website && <div>{personal.website}</div>}
          </div>
        </div>
      </header>

      {personal.summary && (
        <section style={{ marginBottom: "4mm" }}>
          <h2 style={{ margin: 0, fontSize: "10pt", letterSpacing: "0.14em", color: "var(--resume-accent, #0f766e)" }}>EXECUTIVE SUMMARY</h2>
          <p style={{ margin: "1.5mm 0 0", color: "var(--resume-text-muted, #475569)" }}>{personal.summary}</p>
        </section>
      )}

      {experience_details.length > 0 && (
        <section style={{ marginBottom: "4mm" }}>
          <h2 style={{ margin: 0, fontSize: "10pt", letterSpacing: "0.14em", color: "var(--resume-accent, #0f766e)" }}>PROFESSIONAL EXPERIENCE</h2>
          {experience_details.map((exp, index) => (
            <div key={index} style={{ borderBottom: "1px solid var(--resume-border, #e2e8f0)", padding: "2mm 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "3mm" }}>
                <strong>{exp.position}</strong>
                <span style={{ color: "var(--resume-text-muted, #475569)", fontSize: "9pt" }}>{formatDate(exp.start_date)} - {exp.present ? "Present" : formatDate(exp.end_date)}</span>
              </div>
              <p style={{ margin: "0.6mm 0", color: "var(--resume-accent-dark, #115e59)", fontWeight: 600 }}>{exp.company_name}</p>
              {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: "5mm", color: "var(--resume-text-muted, #475569)" }}>
                  {exp.responsibilities.slice(0, 4).map((item: string, i: number) => item ? <li key={i}>{item}</li> : null)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5mm" }}>
        <section>
          {volunteer_details.length > 0 && (
            <>
              <h2 style={{ margin: 0, fontSize: "10pt", letterSpacing: "0.14em", color: "var(--resume-accent, #0f766e)" }}>LEADERSHIP / VOLUNTEER</h2>
              {volunteer_details.slice(0, 3).map((vol, index) => (
                <p key={index} style={{ margin: "1.2mm 0", color: "var(--resume-text-muted, #475569)" }}>
                  <strong>{vol.role}</strong> - {vol.organization_name}
                </p>
              ))}
            </>
          )}

          {education_details.length > 0 && (
            <>
              <h2 style={{ margin: "3mm 0 0", fontSize: "10pt", letterSpacing: "0.14em", color: "var(--resume-accent, #0f766e)" }}>EDUCATION</h2>
              {education_details.map((edu, index) => (
                <div key={index} style={{ marginTop: "1.4mm" }}>
                  <strong>{edu.degree}</strong>
                  <p style={{ margin: "0.5mm 0", color: "var(--resume-text-muted, #475569)" }}>{edu.school_name}</p>
                </div>
              ))}
            </>
          )}
        </section>

        <section>
          {skillList.length > 0 && (
            <>
              <h2 style={{ margin: 0, fontSize: "10pt", letterSpacing: "0.14em", color: "var(--resume-accent, #0f766e)" }}>CORE SKILLS</h2>
              <p style={{ margin: "1.2mm 0 0", color: "var(--resume-text-muted, #475569)" }}>{skillList.join(" • ")}</p>
            </>
          )}

          {projects.length > 0 && (
            <>
              <h2 style={{ margin: "3mm 0 0", fontSize: "10pt", letterSpacing: "0.14em", color: "var(--resume-accent, #0f766e)" }}>PROJECT HIGHLIGHTS</h2>
              {projects.slice(0, 2).map((project, index) => (
                <div key={index} style={{ marginTop: "1.2mm" }}>
                  <strong>{project.title}</strong>
                  {project.description && <p style={{ margin: "0.5mm 0", color: "var(--resume-text-muted, #475569)" }}>{project.description}</p>}
                </div>
              ))}
            </>
          )}

          {hobbyList.length > 0 && (
            <>
              <h2 style={{ margin: "3mm 0 0", fontSize: "10pt", letterSpacing: "0.14em", color: "var(--resume-accent, #0f766e)" }}>INTERESTS</h2>
              <p style={{ margin: "1.2mm 0 0", color: "var(--resume-text-muted, #475569)" }}>{hobbyList.join(" • ")}</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
