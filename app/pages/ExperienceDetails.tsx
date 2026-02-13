"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  ListTodo,
  Plus,
  Trash2,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  X,
  Trophy
} from "lucide-react";
import { experienceSchema } from "../utils/validationSchemas";
import { saveExperienceDetails, loadExperienceDetails, clearExperienceDetails, notifyResumeUpdate } from "../lib/storage";

interface Experience {
  company_name: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  present: boolean;
  responsibilities: string[];
  achievements: string[];
}

interface ExperienceDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  experiences: Experience[];
}

// Generate unique ID for keys
let experienceIdCounter = 0;
const generateExperienceId = () => `experience-${Date.now()}-${experienceIdCounter++}`;

const ExperienceCard = ({
  index,
  experience,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
  experienceId,
}: {
  index: number;
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
  experienceId: string;
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {experience.position || `Experience ${index + 1}`}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {experience.company_name || "Click to edit details"}
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
            key={`content-${experienceId}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    Company Name *
                  </label>
                  <Field
                    name={`experiences.${index}.company_name`}
                    placeholder="Google"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.company_name`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    Position / Title *
                  </label>
                  <Field
                    name={`experiences.${index}.position`}
                    placeholder="Senior Software Engineer"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.position`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Location
                  </label>
                  <Field
                    name={`experiences.${index}.location`}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Start Date *
                  </label>
                  <Field
                    type="date"
                    name={`experiences.${index}.start_date`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.start_date`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    End Date
                  </label>
                  <Field
                    type="date"
                    name={`experiences.${index}.end_date`}
                    disabled={experience.present}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.end_date`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* Present Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
                    <Field
                      type="checkbox"
                      name={`experiences.${index}.present`}
                      className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-300">
                      Currently working here
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400 ml-auto" />
                  </label>
                </div>

                {/* Responsibilities */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-amber-500" />
                    Key Responsibilities *
                  </label>
                  <FieldArray name={`experiences.${index}.responsibilities`}>
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {experience.responsibilities.map((_, respIndex) => (
                          <div
                            key={respIndex}
                            className="flex gap-2"
                          >
                            <Field
                              name={`experiences.${index}.responsibilities.${respIndex}`}
                              placeholder="Led a team of 5 developers to deliver project on time"
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                            <button
                              type="button"
                              onClick={() => remove(respIndex)}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Responsibility
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage
                    name={`experiences.${index}.responsibilities`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                {/* Achievements */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Key Achievements (Optional)
                  </label>
                  <FieldArray name={`experiences.${index}.achievements`}>
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {experience.achievements?.map((_, achIndex) => (
                          <div
                            key={achIndex}
                            className="flex gap-2"
                          >
                            <Field
                              name={`experiences.${index}.achievements.${achIndex}`}
                              placeholder="Increased revenue by 25% through optimization"
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                            <button
                              type="button"
                              onClick={() => remove(achIndex)}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Achievement
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExperienceDetails: React.FC<ExperienceDetailsProps> = ({ onNext }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [initialValues, setInitialValues] = useState<MyFormValues>({ experiences: [] });
  const [isLoading, setIsLoading] = useState(true);
  // Store stable IDs for each experience
  const [experienceIds, setExperienceIds] = useState<string[]>([]);

  useEffect(() => {
    const savedData = loadExperienceDetails();
    if (savedData && savedData.length > 0) {
      setInitialValues({ experiences: savedData });
      // Generate stable IDs for saved experiences
      setExperienceIds(savedData.map(() => generateExperienceId()));
    } else {
      setInitialValues({ experiences: [] });
      setExperienceIds([]);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = async (values: MyFormValues) => {
    setIsSubmitting(true);
    try {
      saveExperienceDetails(values.experiences);
      notifyResumeUpdate();
      onNext();
    } catch (error) {
      console.error("Error saving experience details:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddExperience = useCallback((push: (obj: any) => void, length: number) => {
    const newExperience = {
      company_name: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      present: false,
      responsibilities: [""],
      achievements: [],
    };
    push(newExperience);
    setExperienceIds(prev => [...prev, generateExperienceId()]);
    // Expand the newly added experience
    setExpandedIndex(length);
  }, []);

  const handleRemoveExperience = useCallback((remove: (index: number) => void, index: number, values: MyFormValues) => {
    remove(index);
    setExperienceIds(prev => prev.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
    // Auto-save after removal
    const newExperiences = values.experiences.filter((_, i) => i !== index);
    saveExperienceDetails(newExperiences);
    notifyResumeUpdate();
  }, [expandedIndex]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Add your work history if you have it. You can skip this section.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={experienceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({ values, setValues }) => (
          <Form className="space-y-6">
            <FieldArray name="experiences">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {values.experiences.map((experience, index) => (
                      <ExperienceCard
                        key={experienceIds[index] || index}
                        index={index}
                        experience={experience}
                        isExpanded={expandedIndex === index}
                        onToggle={() =>
                          setExpandedIndex(expandedIndex === index ? -1 : index)
                        }
                        onRemove={() => handleRemoveExperience(remove, index, values)}
                        canRemove={values.experiences.length > 0}
                        experienceId={experienceIds[index] || String(index)}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Add Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAddExperience(push, values.experiences.length)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Experience
                  </motion.button>
                </div>
              )}
            </FieldArray>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  clearExperienceDetails();
                  setValues({
                    experiences: [],
                  });
                  setExperienceIds([]);
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
                    saveExperienceDetails(values.experiences);
                    notifyResumeUpdate();
                  }}
                  className="px-6 py-3 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ExperienceDetails;
