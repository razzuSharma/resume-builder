"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  Calendar,
  Link,
  Github,
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  X,
  ExternalLink,
  Wand2
} from "lucide-react";
import { projectSchema } from "../utils/validationSchemas";
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

interface Project {
  name: string;
  start_date: string;
  end_date: string | null;
  present: boolean;
  link: string;
  github_link: string;
  description: string;
  technologies: string[];
  newTech?: string;
}

interface ProjectDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  projects: Project[];
  user_id?: string;
}

const ProjectCard = ({
  index,
  project,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
}: {
  index: number;
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <FolderGit2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {project.name || `Project ${index + 1}`}
            </h3>
            <p className="text-sm text-gray-500">
              {project.description
                ? project.description.substring(0, 50) + "..."
                : "Click to edit details"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100">
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                {/* Project Name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-500" />
                    Project Name *
                  </label>
                  <Field
                    name={`projects.${index}.name`}
                    placeholder="E-Commerce Platform"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`projects.${index}.name`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Project Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Link className="w-4 h-4 text-emerald-500" />
                    Live Demo URL
                  </label>
                  <div className="relative">
                    <Field
                      name={`projects.${index}.link`}
                      type="url"
                      placeholder="https://myproject.com"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* GitHub Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Github className="w-4 h-4 text-emerald-500" />
                    GitHub URL
                  </label>
                  <div className="relative">
                    <Field
                      name={`projects.${index}.github_link`}
                      type="url"
                      placeholder="https://github.com/username/project"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    <Github className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    Start Date *
                  </label>
                  <Field
                    type="date"
                    name={`projects.${index}.start_date`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`projects.${index}.start_date`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    End Date
                  </label>
                  <Field
                    type="date"
                    name={`projects.${index}.end_date`}
                    disabled={project.present}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Present Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 cursor-pointer hover:bg-emerald-100 transition-colors">
                    <Field
                      type="checkbox"
                      name={`projects.${index}.present`}
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-emerald-900">
                      This project is ongoing
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                  </label>
                </div>

                {/* Technologies */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-emerald-500" />
                    Technologies Used
                  </label>
                  <FieldArray name={`projects.${index}.technologies`}>
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => remove(techIndex)}
                                className="ml-1 text-emerald-600 hover:text-emerald-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Field
                            name={`projects.${index}.newTech`}
                            placeholder="Add technology (e.g., React, Node.js)"
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            onKeyPress={(e: any) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value && !project.technologies?.includes(value)) {
                                  push(value);
                                  e.target.value = "";
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.querySelector(`[name="projects.${index}.newTech"]`) as HTMLInputElement;
                              const value = input?.value.trim();
                              if (value && !project.technologies?.includes(value)) {
                                push(value);
                                input.value = "";
                              }
                            }}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Project Description *
                  </label>
                  <Field
                    as="textarea"
                    name={`projects.${index}.description`}
                    rows={4}
                    placeholder="Describe your project, what problem it solves, and your role..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                  />
                  <ErrorMessage
                    name={`projects.${index}.description`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ onNext }) => {
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const initialValues: MyFormValues = {
    projects: [
      {
        name: "",
        start_date: "",
        end_date: "",
        present: false,
        link: "",
        github_link: "",
        description: "",
        technologies: [],
        newTech: "",
      },
    ],
    user_id: userId,
  };

  const handleSubmit = async (values: MyFormValues, { setSubmitting }: any) => {
    setIsSubmitting(true);
    try {
      const adjustedValues = values.projects.map((project) => {
        const { newTech, ...rest } = project as any;
        return {
          ...rest,
          user_id: userId,
        };
      });
      await saveDataIntoSupabase("project_details", adjustedValues);
      onNext();
    } catch (error) {
      console.error("Error saving project details:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <FolderGit2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        </div>
        <p className="text-gray-600">
          Showcase your projects and portfolio work. Highlight what you built and technologies used.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={projectSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleReset }) => (
          <Form className="space-y-6">
            <FieldArray name="projects">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {values.projects.map((project, index) => (
                      <ProjectCard
                        key={index}
                        index={index}
                        project={project}
                        isExpanded={expandedIndex === index}
                        onToggle={() =>
                          setExpandedIndex(expandedIndex === index ? -1 : index)
                        }
                        onRemove={() => {
                          remove(index);
                          if (expandedIndex === index) {
                            setExpandedIndex(-1);
                          }
                        }}
                        canRemove={values.projects.length > 1}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={() => {
                      push({
                        name: "",
                        start_date: "",
                        end_date: "",
                        present: false,
                        link: "",
                        github_link: "",
                        description: "",
                        technologies: [],
                        newTech: "",
                      });
                      setExpandedIndex(values.projects.length);
                    }}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Project
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => handleReset()}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ProjectDetails;
