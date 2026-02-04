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
  GraduationCap,
  Briefcase,
  FolderGit2,
  Heart,
  Wand2,
  ExternalLink,
  Calendar,
  Award,
  Languages,
} from "lucide-react";

interface ResumeLayoutProps {
  personal_details: any[];
  education_details: any[];
  experience_details: any[];
  skills: any[];
  project_details: any[];
  hobbies: any[];
  certifications?: any[];
  languages?: any[];
}

const ResumeLayout: React.FC<ResumeLayoutProps> = ({
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
    <div className="bg-white text-gray-900 min-h-[297mm] flex flex-col px-[16mm] pt-[14mm] pb-[12mm]">
      {/* Header */}
      <header className="border-b border-gray-300 pb-5 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          {personal.profile_image_url && (
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                <Image
                  src={personal.profile_image_url}
                  alt={`${personal.first_name} ${personal.last_name}`}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-[34px] leading-[1.05] font-bold text-gray-900 mb-2">
              {personal.first_name || "First Name"} {personal.last_name || "Last Name"}
            </h1>
            {personal.summary && (
              <p className="text-gray-600 text-[13px] leading-relaxed mb-4 max-w-3xl">
                {personal.summary}
              </p>
            )}
            
            {/* Contact Info */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] leading-snug">
              {personal.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-700 hover:underline"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {personal.website && (
                <a
                  href={personal.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8 flex-1">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-7">
          {/* Experience */}
          {experience_details.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <Briefcase className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.14em]">
                  Work Experience
                </h2>
              </div>
              <div className="space-y-5">
                {experience_details.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-snug">{exp.position}</h3>
                        <p className="text-gray-800 leading-snug">{exp.company_name}</p>
                        {exp.location && (
                          <p className="text-[12px] text-gray-500 leading-snug">{exp.location}</p>
                        )}
                      </div>
                      <span className="text-[12px] text-gray-500 flex items-center gap-1 flex-shrink-0 tabular-nums">
                        <Calendar className="w-3 h-3" />
                        {formatDate(exp.start_date)} -{" "}
                        {exp.present ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside text-[12.5px] leading-relaxed text-gray-700 mt-2 space-y-1">
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
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <GraduationCap className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.14em]">
                  Education
                </h2>
              </div>
              <div className="space-y-4">
                {education_details.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-snug">{edu.school_name}</h3>
                        <p className="text-gray-800 leading-snug">
                          {edu.degree} in {edu.field_of_study}
                        </p>
                        {edu.gpa && (
                          <p className="text-[12px] text-gray-500 leading-snug">GPA: {edu.gpa}</p>
                        )}
                      </div>
                      <span className="text-[12px] text-gray-500 flex items-center gap-1 flex-shrink-0 tabular-nums">
                        <Calendar className="w-3 h-3" />
                        {formatDate(edu.start_date)} -{" "}
                        {edu.present ? "Present" : formatDate(edu.end_date)}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-[12.5px] leading-relaxed text-gray-700 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {project_details.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <FolderGit2 className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.14em]">
                  Projects
                </h2>
              </div>
              <div className="space-y-4">
                {project_details.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 leading-snug">{project.name}</h3>
                      <span className="text-[12px] text-gray-500 flex items-center gap-1 flex-shrink-0 tabular-nums">
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.start_date)} -{" "}
                        {project.present ? "Present" : formatDate(project.end_date)}
                      </span>
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-[12.5px] leading-relaxed text-gray-700 mb-1">
                        <span className="font-medium">Technologies:</span>{" "}
                        {project.technologies.join(", ")}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-[12.5px] leading-relaxed text-gray-700 mb-1">{project.description}</p>
                    )}
                    <div className="flex gap-3 mt-1">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] text-blue-700 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Project
                        </a>
                      )}
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] text-gray-700 hover:underline"
                        >
                          <Github className="w-3 h-3" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-7">
          {/* Skills */}
          {skillList.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <Wand2 className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.14em]">
                  Skills
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-100 text-gray-800 text-[12px] rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <Award className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.14em]">
                  Certifications
                </h2>
              </div>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 leading-snug">{cert.name}</h3>
                    <p className="text-[12.5px] text-gray-700 leading-snug">{cert.issuing_organization}</p>
                    <p className="text-[11.5px] text-gray-500 tabular-nums">
                      {formatDate(cert.issue_date)}
                      {cert.expiry_date && ` - ${formatDate(cert.expiry_date)}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <Languages className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.14em]">
                  Languages
                </h2>
              </div>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-800 text-[12.5px]">{lang.language}</span>
                    <span className="text-[12px] text-gray-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {hobbyList.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                <Heart className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.14em]">
                  Interests
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {hobbyList.map((hobby: string, index: number) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-100 text-gray-800 text-[12px] rounded-md"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeLayout;
