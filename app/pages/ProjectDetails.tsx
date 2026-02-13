"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { saveProjectDetails, loadProjectDetails, clearProjectDetails, notifyResumeUpdate } from "../lib/storage";

interface Project {
  name: string;
  start_date: string;
  end_date: string | null;
  present: boolean;
  link: string;
  github_link: string;
  role: string;
  description: string;
  outcome: string;
  technologies: string[];
  newTech?: string;
}

interface ProjectDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  projects: Project[];
}

// Generate unique ID for keys
let projectIdCounter = 0;
const generateProjectId = () => `project-${Date.now()}-${projectIdCounter++}`;

const ProjectCard = ({
  index,
  project,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
  projectId,
}: {
  index: number;
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
  projectId: string;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <FolderGit2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {project.name || `Work Sample ${index + 1}`}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {project.description
                ? project.description.substring(0, 50) + "..."
                : "Click to edit details"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`content-${projectId}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                {/* Work Sample Title */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-500" />
                    Work Sample / Project / Key Work Title *
                  </label>
                  <Field
                    name={`projects.${index}.name`}
                    placeholder="Community Health Outreach Program"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <ErrorMessage
                    name={`projects.${index}.name`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* Primary Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Link className="w-4 h-4 text-emerald-500" />
                    Reference Link (Optional)
                  </label>
                  <div className="relative">
                    <Field
                      name={`projects.${index}.link`}
                      type="url"
                      placeholder="https://portfolio.example.com/work-sample"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>

                {/* Supporting Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Github className="w-4 h-4 text-emerald-500" />
                    Supporting Link (Optional)
                  </label>
                  <div className="relative">
                    <Field
                      name={`projects.${index}.github_link`}
                      type="url"
                      placeholder="https://drive.google.com/... or https://github.com/..."
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <Github className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Your Role (Optional)
                  </label>
                  <Field
                    name={`projects.${index}.role`}
                    placeholder="Program Lead, Coordinator, Assistant, Analyst"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    Start Date *
                  </label>
                  <Field
                    type="date"
                    name={`projects.${index}.start_date`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`projects.${index}.start_date`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    End Date
                  </label>
                  <Field
                    type="date"
                    name={`projects.${index}.end_date`}
                    disabled={project.present}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Present Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                    <Field
                      type="checkbox"
                      name={`projects.${index}.present`}
                      className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                      This work is ongoing
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 ml-auto" />
                  </label>
                </div>

                {/* Tools / Skills / Methods */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-emerald-500" />
                    Tools / Skills / Methods Used (Optional)
                  </label>
                  <FieldArray name={`projects.${index}.technologies`}>
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => remove(techIndex)}
                                className="ml-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Field
                            name={`projects.${index}.newTech`}
                            placeholder="Add tool or skill (e.g., CRM, Excel, Canva, React)"
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const value = e.currentTarget.value.trim();
                                if (value && !project.technologies?.includes(value)) {
                                  push(value);
                                  e.currentTarget.value = "";
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
                            className="px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    What You Did *
                  </label>
                  <Field
                    as="textarea"
                    name={`projects.${index}.description`}
                    rows={4}
                    placeholder="Describe the work, your responsibilities, and the impact..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <ErrorMessage
                    name={`projects.${index}.description`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* Outcome */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Outcome / Result (Optional)
                  </label>
                  <Field
                    as="textarea"
                    name={`projects.${index}.outcome`}
                    rows={2}
                    placeholder="Example: Improved customer satisfaction by 18% in one quarter."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [initialValues, setInitialValues] = useState<MyFormValues>({ projects: [] });
  const [isLoading, setIsLoading] = useState(true);
  // Store stable IDs for each project
  const [projectIds, setProjectIds] = useState<string[]>([]);

  useEffect(() => {
    const savedData = loadProjectDetails();
    if (savedData && savedData.length > 0) {
      setInitialValues({ projects: savedData });
      // Generate stable IDs for saved projects
      setProjectIds(savedData.map(() => generateProjectId()));
    } else {
      setInitialValues({ projects: [] });
      setProjectIds([]);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = async (values: MyFormValues) => {
    setIsSubmitting(true);
    try {
      // Strip newTech field before saving
      const projectsToSave = values.projects.map(({ newTech, ...rest }) => rest);
      saveProjectDetails(projectsToSave);
      notifyResumeUpdate();
      onNext();
    } catch (error) {
      console.error("Error saving project details:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProject = useCallback((push: (obj: any) => void, length: number) => {
    const newProject = {
      name: "",
      start_date: "",
      end_date: "",
      present: false,
      link: "",
      github_link: "",
      role: "",
      description: "",
      outcome: "",
      technologies: [],
      newTech: "",
    };
    push(newProject);
    setProjectIds(prev => [...prev, generateProjectId()]);
    // Expand the newly added project
    setExpandedIndex(length);
  }, []);

  const handleRemoveProject = useCallback((remove: (index: number) => void, index: number, values: MyFormValues) => {
    remove(index);
    setProjectIds(prev => prev.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
    // Auto-save after removal
    const newProjects = values.projects.filter((_, i) => i !== index);
    const projectsToSave = newProjects.map(({ newTech, ...rest }) => rest);
    saveProjectDetails(projectsToSave);
    notifyResumeUpdate();
  }, [expandedIndex]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Samples</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Add projects, portfolio items, case studies, campaigns, or key work samples. You can skip this section.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={projectSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({ values, resetForm }) => (
          <Form className="space-y-6">
            <FieldArray name="projects">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {values.projects.map((project, index) => (
                      <ProjectCard
                        key={projectIds[index] || index}
                        index={index}
                        project={project}
                        isExpanded={expandedIndex === index}
                        onToggle={() =>
                          setExpandedIndex(expandedIndex === index ? -1 : index)
                        }
                        onRemove={() => handleRemoveProject(remove, index, values)}
                        canRemove={values.projects.length > 0}
                        projectId={projectIds[index] || String(index)}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Add Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAddProject(push, values.projects.length)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Work Sample
                  </motion.button>
                </div>
              )}
            </FieldArray>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  clearProjectDetails();
                  resetForm({
                    values: {
                      projects: [],
                    },
                  });
                  setProjectIds([]);
                  setExpandedIndex(-1);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const projectsToSave = values.projects.map(({ newTech, ...rest }) => rest);
                    saveProjectDetails(projectsToSave);
                    notifyResumeUpdate();
                  }}
                  className="px-6 py-3 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
                >
                  Save Draft
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
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ProjectDetails;
