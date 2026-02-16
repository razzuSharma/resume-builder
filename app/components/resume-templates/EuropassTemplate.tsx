"use client";

import React from "react";
import Image from "next/image";
import { CalendarDays, Mail, MapPin, Phone, User } from "lucide-react";
import type { TemplateId } from "../../lib/templates";

interface EuropassTemplateProps {
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
  fontScale?: number;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const readSkills = (skills: any[]) => {
  if (!Array.isArray(skills) || skills.length === 0) return [] as string[];
  if (skills.every((item) => typeof item === "string")) {
    return skills.filter((item): item is string => !!item && item.trim().length > 0);
  }

  const values = skills.flatMap((item: any) => {
    if (typeof item?.skill_name === "string") return [item.skill_name];
    if (Array.isArray(item?.skills)) return item.skills;
    if (typeof item?.skills === "string") return item.skills.split(",");
    return [];
  });

  return values.map((value) => String(value).trim()).filter(Boolean);
};

const readHobbies = (hobbies: any[]) => {
  if (!Array.isArray(hobbies) || hobbies.length === 0) return [] as string[];
  if (hobbies.every((item) => typeof item === "string")) {
    return hobbies.filter((item): item is string => !!item && item.trim().length > 0);
  }

  const values = hobbies.flatMap((item: any) => {
    if (typeof item?.hobby_name === "string") return [item.hobby_name];
    if (Array.isArray(item?.hobbies)) return item.hobbies;
    if (typeof item?.hobbies === "string") return item.hobbies.split(",");
    return [];
  });

  return values.map((value) => String(value).trim()).filter(Boolean);
};

const proficiencyToCefr = (proficiency: string) => {
  switch (String(proficiency || "").toLowerCase()) {
    case "native":
      return "C2";
    case "fluent":
      return "C1";
    case "conversational":
      return "B1";
    case "basic":
      return "A2";
    default:
      return "A1";
  }
};

const EuropassTemplate: React.FC<EuropassTemplateProps> = ({
  personal_details,
  education_details,
  experience_details,
  volunteer_details = [],
  skills,
  project_details,
  hobbies,
  languages,
  fontScale = 1,
}) => {
  const personal = personal_details[0] || {};
  const skillList = readSkills(skills);
  const hobbyList = readHobbies(hobbies);
  const safeLanguages = Array.isArray(languages) ? languages : [];

  const communicationPoints = volunteer_details
    .flatMap((vol: any) => (Array.isArray(vol.contributions) ? vol.contributions : []))
    .filter(Boolean)
    .slice(0, 6);

  const titleStyle: React.CSSProperties = {
    margin: "0 0 1.8mm",
    fontSize: `${10.8 * fontScale}pt`,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    color: "#1f4f95",
    borderBottom: "1px solid #9ca3af",
    paddingBottom: "0.8mm",
  };

  return (
    <div
      className="europass-resume"
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        padding: "6mm 10mm 10mm",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: `${9.8 * fontScale}pt`,
        lineHeight: 1.4,
        color: "#111827",
        background: "#f2f2f2",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "6mm",
          background: "#6ea0d2",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "6mm",
          left: 0,
          width: "5mm",
          height: "16mm",
          background: "#6ea0d2",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "6mm",
          right: 0,
          width: "5mm",
          height: "16mm",
          background: "#6ea0d2",
        }}
      />

      <header style={{ marginBottom: "5mm", paddingTop: "7mm" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2mm" }}>
          <Image src="/Europass.png" alt="Europass" width={211} height={56} style={{ width: "50mm", height: "auto" }} priority />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "40mm 1fr", gap: "7mm", alignItems: "start" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {personal.profile_image_url ? (
              <div
                style={{
                  width: "40mm",
                  height: "58mm",
                  border: "1px solid #374151",
                  borderRadius: "20mm",
                  overflow: "hidden",
                  background: "#c8e3f2",
                }}
              >
                <Image
                  src={personal.profile_image_url}
                  alt={`${personal.first_name || ""} ${personal.last_name || ""}`.trim() || "Profile"}
                  width={152}
                  height={220}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "40mm",
                  height: "58mm",
                  border: "1px solid #374151",
                  borderRadius: "20mm",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                }}
              >
                <User style={{ width: "14mm", height: "14mm" }} />
              </div>
            )}
          </div>

          <div>
            <h1
              style={{
                margin: "0 0 1.5mm",
                fontSize: `${12.8 * fontScale}pt`,
                color: "#1f4f95",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {personal.first_name || "FIRST"} {personal.last_name || "LAST"}
            </h1>

            {personal.nationality && <p style={{ margin: "0 0 0.8mm" }}><strong>Nationality:</strong> {personal.nationality}</p>}
            {personal.phone && (
              <p style={{ margin: "0 0 0.8mm", display: "flex", alignItems: "center", gap: "1.5mm", color: "#1f4f95" }}>
                <Phone style={{ width: "3.5mm", height: "3.5mm" }} /> <span style={{ color: "#374151" }}>{personal.phone}</span>
              </p>
            )}
            {personal.date_of_birth && (
              <p style={{ margin: "0 0 0.8mm", display: "flex", alignItems: "center", gap: "1.5mm" }}>
                <CalendarDays style={{ width: "3.5mm", height: "3.5mm", color: "#1f4f95" }} />
                <span><strong>Date of birth:</strong> {formatDate(personal.date_of_birth)}</span>
              </p>
            )}
            {personal.gender && <p style={{ margin: "0 0 0.8mm" }}><strong>Gender:</strong> {personal.gender}</p>}
            {personal.email && (
              <p style={{ margin: "0 0 0.8mm", display: "flex", alignItems: "center", gap: "1.5mm" }}>
                <Mail style={{ width: "3.5mm", height: "3.5mm", color: "#1f4f95" }} />
                <span><strong>Email address:</strong> {personal.email}</span>
              </p>
            )}
            {(personal.location || personal.permanent_address) && (
              <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "1.5mm" }}>
                <MapPin style={{ width: "3.5mm", height: "3.5mm", color: "#1f4f95" }} />
                <span><strong>Address:</strong> {personal.location || personal.permanent_address}</span>
              </p>
            )}
          </div>
        </div>
      </header>

      {!!personal.summary && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>About Me</h2>
          <p style={{ margin: 0 }}>{personal.summary}</p>
        </section>
      )}

      {experience_details.length > 0 && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>Work Experience</h2>
          <ul style={{ margin: 0, paddingLeft: "5mm", listStyleType: "none" }}>
            {experience_details.map((exp, index) => (
              <li key={index} style={{ marginBottom: "1.8mm", position: "relative", paddingLeft: "4mm" }}>
                <span style={{ position: "absolute", left: 0, color: "#6b7280" }}>➤</span>
                <span style={{ fontWeight: 700 }}>{exp.position || "Role"}</span>
                {exp.company_name ? ` at ${exp.company_name}` : ""}
                {exp.location ? `, ${exp.location}` : ""}
                {(exp.start_date || exp.end_date || exp.present) && (
                  <span>
                    {" "}
                    ({formatDate(exp.start_date)} - {exp.present ? "Present" : formatDate(exp.end_date)})
                  </span>
                )}
                {Array.isArray(exp.responsibilities) && exp.responsibilities.filter(Boolean).length > 0 && (
                  <ul style={{ marginTop: "1mm", paddingLeft: "4.5mm", listStyleType: "disc" }}>
                    {exp.responsibilities
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {education_details.length > 0 && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>Education And Training</h2>
          {education_details.map((edu, index) => (
            <p key={index} style={{ margin: "0 0 1.2mm" }}>
              <strong>{edu.degree || "Qualification"}</strong>
              {edu.school_name ? ` from ${edu.school_name}` : ""}
              {edu.field_of_study ? `, ${edu.field_of_study}` : ""}
              {(edu.start_date || edu.end_date || edu.present) && (
                <span>
                  {" "}
                  ({formatDate(edu.start_date)} - {edu.present ? "Present" : formatDate(edu.end_date)})
                </span>
              )}
            </p>
          ))}
        </section>
      )}

      {(skillList.length > 0 || safeLanguages.length > 0) && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>Language Skills</h2>
          {safeLanguages.length > 0 ? (
            <div>
              <p style={{ margin: "0 0 1mm" }}>
                Mother tongue(s): <strong>{safeLanguages[0]?.language || "N/A"}</strong>
              </p>
              {safeLanguages.length > 1 && <p style={{ margin: "0 0 1mm" }}>Other language(s):</p>}
              {safeLanguages.map((lang: any, index: number) => (
                <div key={index} style={{ margin: index === 0 ? 0 : "0 0 2mm" }}>
                  <p style={{ margin: "0 0 0.6mm", color: "#1f4f95", fontWeight: 700 }}>{lang.language}</p>
                  <p style={{ margin: "0 0 0.5mm", fontWeight: 700, color: "#4b5563" }}>
                    LISTENING {proficiencyToCefr(lang.proficiency)}{" "}
                    READING {proficiencyToCefr(lang.proficiency)}{" "}
                    WRITING {proficiencyToCefr(lang.proficiency)}
                  </p>
                  <p style={{ margin: 0, fontWeight: 700, color: "#4b5563" }}>
                    SPOKEN PRODUCTION {proficiencyToCefr(lang.proficiency)}{" "}
                    SPOKEN INTERACTION {proficiencyToCefr(lang.proficiency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0 }}>{skillList.join(" • ")}</p>
          )}
        </section>
      )}

      {(communicationPoints.length > 0 || skillList.length > 0) && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>Communication And Interpersonal Skills</h2>
          <ul style={{ margin: 0, paddingLeft: "5mm" }}>
            {communicationPoints.length > 0
              ? communicationPoints.map((item: string, idx: number) => <li key={idx}>{item}</li>)
              : skillList.slice(0, 5).map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </section>
      )}

      {(personal.permanent_address ||
        personal.passport_number ||
        personal.passport_issue_date ||
        personal.passport_expiry_date ||
        personal.father_name ||
        personal.marital_status) && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>Personal Details</h2>
          {personal.permanent_address && <p style={{ margin: "0 0 1mm" }}><strong>Permanent Address:</strong> {personal.permanent_address}</p>}
          {personal.passport_number && <p style={{ margin: "0 0 1mm" }}><strong>Passport No:</strong> {personal.passport_number}</p>}
          {(personal.passport_issue_date || personal.passport_expiry_date) && (
            <p style={{ margin: "0 0 1mm" }}>
              <strong>Passport Dates:</strong> {personal.passport_issue_date ? formatDate(personal.passport_issue_date) : "-"} to {personal.passport_expiry_date ? formatDate(personal.passport_expiry_date) : "-"}
            </p>
          )}
          {personal.father_name && <p style={{ margin: "0 0 1mm" }}><strong>Father&apos;s Name:</strong> {personal.father_name}</p>}
          {personal.marital_status && <p style={{ margin: 0 }}><strong>Marital Status:</strong> {personal.marital_status}</p>}
        </section>
      )}

      {hobbyList.length > 0 && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>Hobbies And Interests</h2>
          <p style={{ margin: 0 }}>{hobbyList.join(", ")}</p>
        </section>
      )}

      {project_details.length > 0 && (
        <section style={{ marginBottom: "4.4mm" }}>
          <h2 style={titleStyle}>Additional Information</h2>
          <ul style={{ margin: 0, paddingLeft: "5mm" }}>
            {project_details.slice(0, 3).map((project, index) => (
              <li key={index}>
                <strong>{project.name || "Project"}</strong>
                {project.description ? `: ${project.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 style={titleStyle}>Declaration</h2>
        <p style={{ margin: 0 }}>
          {personal.declaration_text ||
            "I declare that the information given above is true to the best of my knowledge and belief."}
        </p>
      </section>
    </div>
  );
};

export default EuropassTemplate;
