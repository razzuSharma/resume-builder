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
    <div className="min-h-[297mm] flex flex-col px-[16mm] pt-[14mm] pb-[12mm]" style={{ backgroundColor: 'var(--resume-bg)', color: 'var(--resume-text)' }}>
      {/* Header */}
      <header className="border-b pb-5 mb-6" style={{ borderColor: 'var(--resume-border)' }}>
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          {personal.profile_image_url && (
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-md" style={{ borderColor: 'var(--resume-border)' }}>
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
            <h1 className="text-[34px] leading-[1.05] font-bold mb-2" style={{ color: 'var(--resume-text)' }}>
              {personal.first_name || "First Name"} {personal.last_name || "Last Name"}
            </h1>
            {personal.summary && (
              <p className="text-[13px] leading-relaxed mb-4 max-w-3xl" style={{ color: 'var(--resume-text-muted)' }}>
                {personal.summary}
              </p>
            )}
            
            {/* Contact Info */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] leading-snug">
              {personal.email && (
                <div className="flex items-center gap-1.5" style={{ color: 'var(--resume-text-muted)' }}>
                  <Mail className="w-4 h-4" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-1.5" style={{ color: 'var(--resume-text-muted)' }}>
                  <Phone className="w-4 h-4" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-1.5" style={{ color: 'var(--resume-text-muted)' }}>
                  <MapPin className="w-4 h-4" />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-1.5" style={{ color: 'var(--resume-text-muted)' }}>
                  <Linkedin className="w-4 h-4" />
                  <span className="break-all">{personal.linkedin}</span>
                </div>
              )}
              {personal.github && (
                <div className="flex items-center gap-1.5" style={{ color: 'var(--resume-text-muted)' }}>
                  <Github className="w-4 h-4" />
                  <span className="break-all">{personal.github}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-1.5" style={{ color: 'var(--resume-text-muted)' }}>
                  <Globe className="w-4 h-4" />
                  <span className="break-all">{personal.website}</span>
                </div>
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
              <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--resume-border)' }}>
                <Briefcase className="w-5 h-5" style={{ color: 'var(--resume-text)' }} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--resume-accent)' }}>
                  Work Experience
                </h2>
              </div>
              <div className="space-y-5">
                {experience_details.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold leading-snug" style={{ color: 'var(--resume-text)' }}>{exp.position}</h3>
                        <p className="leading-snug" style={{ color: 'var(--resume-text)' }}>{exp.company_name}</p>
                        {exp.location && (
                          <p className="text-[12px] leading-snug" style={{ color: 'var(--resume-text-muted)' }}>{exp.location}</p>
                        )}
                      </div>
                      <span className="text-[12px] flex items-center gap-1 flex-shrink-0 tabular-nums" style={{ color: 'var(--resume-text-muted)' }}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(exp.start_date)} -{" "}
                        {exp.present ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside text-[12.5px] leading-relaxed mt-2 space-y-1" style={{ color: 'var(--resume-text-muted)' }}>
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
              <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--resume-border)' }}>
                <GraduationCap className="w-5 h-5" style={{ color: 'var(--resume-text)' }} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--resume-accent)' }}>
                  Education
                </h2>
              </div>
              <div className="space-y-4">
                {education_details.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold leading-snug" style={{ color: 'var(--resume-text)' }}>{edu.school_name}</h3>
                        <p className="leading-snug" style={{ color: 'var(--resume-text)' }}>
                          {edu.degree} in {edu.field_of_study}
                        </p>
                        {edu.gpa && (
                          <p className="text-[12px] leading-snug" style={{ color: 'var(--resume-text-muted)' }}>GPA: {edu.gpa}</p>
                        )}
                      </div>
                      <span className="text-[12px] flex items-center gap-1 flex-shrink-0 tabular-nums" style={{ color: 'var(--resume-text-muted)' }}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(edu.start_date)} -{" "}
                        {edu.present ? "Present" : formatDate(edu.end_date)}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-[12.5px] leading-relaxed mt-1" style={{ color: 'var(--resume-text-muted)' }}>{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {project_details.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--resume-border)' }}>
                <FolderGit2 className="w-5 h-5" style={{ color: 'var(--resume-text)' }} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--resume-accent)' }}>
                  Projects
                </h2>
              </div>
              <div className="space-y-4">
                {project_details.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold leading-snug" style={{ color: 'var(--resume-text)' }}>{project.name}</h3>
                      <span className="text-[12px] flex items-center gap-1 flex-shrink-0 tabular-nums" style={{ color: 'var(--resume-text-muted)' }}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.start_date)} -{" "}
                        {project.present ? "Present" : formatDate(project.end_date)}
                      </span>
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-[12.5px] leading-relaxed mb-1" style={{ color: 'var(--resume-text-muted)' }}>
                        <span className="font-medium">Technologies:</span>{" "}
                        {project.technologies.join(", ")}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-[12.5px] leading-relaxed mb-1" style={{ color: 'var(--resume-text-muted)' }}>{project.description}</p>
                    )}
                    <div className="flex gap-3 mt-1">
                      {project.link && (
                        <div className="inline-flex items-center gap-1 text-[12px]" style={{ color: 'var(--resume-text-muted)' }}>
                          <ExternalLink className="w-3 h-3" />
                          <span className="break-all">{project.link}</span>
                        </div>
                      )}
                      {project.github_link && (
                        <div className="inline-flex items-center gap-1 text-[12px]" style={{ color: 'var(--resume-text-muted)' }}>
                          <Github className="w-3 h-3" />
                          <span className="break-all">{project.github_link}</span>
                        </div>
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
              <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--resume-border)' }}>
                <Wand2 className="w-5 h-5" style={{ color: 'var(--resume-text)' }} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--resume-accent)' }}>
                  Skills
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-[12px] rounded-md"
                    style={{ 
                      backgroundColor: 'var(--resume-border)',
                      color: 'var(--resume-text)'
                    }}
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
              <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--resume-border)' }}>
                <Award className="w-5 h-5" style={{ color: 'var(--resume-text)' }} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--resume-accent)' }}>
                  Certifications
                </h2>
              </div>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-medium leading-snug" style={{ color: 'var(--resume-text)' }}>{cert.name}</h3>
                    <p className="text-[12.5px] leading-snug" style={{ color: 'var(--resume-text-muted)' }}>{cert.issuing_organization}</p>
                    <p className="text-[11.5px] tabular-nums" style={{ color: 'var(--resume-text-muted)' }}>
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
              <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--resume-border)' }}>
                <Languages className="w-5 h-5" style={{ color: 'var(--resume-text)' }} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--resume-accent)' }}>
                  Languages
                </h2>
              </div>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-[12.5px]" style={{ color: 'var(--resume-text)' }}>{lang.language}</span>
                    <span className="text-[12px]" style={{ color: 'var(--resume-text-muted)' }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {hobbyList.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--resume-border)' }}>
                <Heart className="w-5 h-5" style={{ color: 'var(--resume-text)' }} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--resume-accent)' }}>
                  Interests
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {hobbyList.map((hobby: string, index: number) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-[12px] rounded-md"
                    style={{ 
                      backgroundColor: 'var(--resume-border)',
                      color: 'var(--resume-text)'
                    }}
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
