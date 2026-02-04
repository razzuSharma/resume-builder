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
  skills: any[];
  project_details: any[];
  hobbies: any[];
  certifications?: any[];
  languages?: any[];
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  personal_details,
  education_details,
  experience_details,
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
      const skillData = skills[0];
      if (typeof skillData.skills === "string") {
        return JSON.parse(skillData.skills);
      }
      return skillData.skills || [];
    } catch {
      return [];
    }
  };

  const getHobbies = () => {
    if (hobbies.length === 0) return [];
    try {
      const hobbyData = hobbies[0];
      if (typeof hobbyData.hobbies === "string") {
        return JSON.parse(hobbyData.hobbies);
      }
      return hobbyData.hobbies || [];
    } catch {
      return [];
    }
  };

  const skillList = getSkills();
  const hobbyList = getHobbies();

  return (
    <div className="bg-white text-gray-900 min-h-[297mm]">
      {/* Modern Header with Sidebar */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-teal-600 to-cyan-700 text-white px-6 pt-[14mm] pb-[12mm] min-h-[297mm]">
          {/* Profile Image */}
          {personal.profile_image_url && (
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 mx-auto">
                <Image
                  src={personal.profile_image_url}
                  alt={`${personal.first_name} ${personal.last_name}`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Name */}
          <h1 className="text-[22px] leading-tight font-bold mb-1 text-center">
            {personal.first_name || "First"}
          </h1>
          <h1 className="text-[22px] leading-tight font-bold mb-5 text-center">
            {personal.last_name || "Last"}
          </h1>

          {/* Contact Info */}
          <div className="space-y-2.5 text-[12px] leading-snug mb-7">
            {personal.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">LinkedIn</span>
              </div>
            )}
            {personal.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">GitHub</span>
              </div>
            )}
            {personal.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">Portfolio</span>
              </div>
            )}
          </div>

          {/* Skills Section */}
          {skillList.length > 0 && (
            <div className="mb-7">
              <h2 className="text-[13px] font-bold mb-3 border-b border-white/30 pb-2 tracking-[0.14em]">
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-white/20 text-white text-[12px] rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="mb-7">
              <h2 className="text-[13px] font-bold mb-3 border-b border-white/30 pb-2 tracking-[0.14em]">
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-[12px] tabular-nums">
                    <span>{lang.language}</span>
                    <span className="text-white/70">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {hobbyList.length > 0 && (
            <div>
              <h2 className="text-[13px] font-bold mb-3 border-b border-white/30 pb-2 tracking-[0.14em]">
                INTERESTS
              </h2>
              <div className="flex flex-wrap gap-2">
                {hobbyList.map((hobby: string, index: number) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-white/20 text-white text-[12px] rounded-full"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 px-7 pt-[14mm] pb-[12mm]">
          {/* Summary */}
          {personal.summary && (
            <section className="mb-7">
              <h2 className="text-[13px] font-bold text-teal-800 mb-3 uppercase tracking-[0.14em]">
                Profile
              </h2>
              <p className="text-[12.5px] leading-relaxed text-gray-700">{personal.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience_details.length > 0 && (
            <section className="mb-7">
              <h2 className="text-[13px] font-bold text-teal-800 mb-3 uppercase tracking-[0.14em]">
                Experience
              </h2>
              <div className="space-y-5">
                {experience_details.map((exp, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-teal-600 font-medium">{exp.company_name}</p>
                    <p className="text-[12px] text-gray-500 mb-2 tabular-nums">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.present ? "Present" : formatDate(exp.end_date)}
                      {exp.location && ` | ${exp.location}`}
                    </p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside text-[12.5px] leading-relaxed text-gray-700 space-y-1">
                        {exp.responsibilities.map((resp: string, i: number) =>
                          resp ? <li key={i}>{resp}</li> : null
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
            <section className="mb-7">
              <h2 className="text-[13px] font-bold text-teal-800 mb-3 uppercase tracking-[0.14em]">
                Education
              </h2>
              <div className="space-y-4">
                {education_details.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-teal-600">{edu.school_name}</p>
                    <p className="text-[12px] text-gray-500">
                      {edu.field_of_study}
                    </p>
                    <p className="text-[12px] text-gray-500 tabular-nums">
                      {formatDate(edu.start_date)} -{" "}
                      {edu.present ? "Present" : formatDate(edu.end_date)}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {project_details.length > 0 && (
            <section className="mb-7">
              <h2 className="text-[13px] font-bold text-teal-800 mb-3 uppercase tracking-[0.14em]">
                Projects
              </h2>
              <div className="space-y-4">
                {project_details.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    <p className="text-[12px] text-gray-500 mb-1 tabular-nums">
                      {formatDate(project.start_date)} -{" "}
                      {project.present ? "Present" : formatDate(project.end_date)}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-[12px] text-teal-700 mb-1">
                        {project.technologies.join(" • ")}
                      </p>
                    )}
                    <p className="text-[12.5px] leading-relaxed text-gray-700">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-[13px] font-bold text-teal-800 mb-3 uppercase tracking-[0.14em]">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-teal-600">{cert.issuing_organization}</p>
                    <p className="text-[12px] text-gray-500 tabular-nums">
                      {formatDate(cert.issue_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
