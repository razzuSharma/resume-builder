"use client";

import React, { useState, useEffect } from "react";
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
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

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
  user_id?: string;
}

const ExperienceCard = ({
  index,
  experience,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
}: {
  index: number;
  experience: Experience;
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {experience.position || `Experience ${index + 1}`}
            </h3>
            <p className="text-sm text-gray-500">
              {experience.company_name || "Click to edit details"}
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
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    Company Name *
                  </label>
                  <Field
                    name={`experiences.${index}.company_name`}
                    placeholder="Google"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.company_name`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    Position / Title *
                  </label>
                  <Field
                    name={`experiences.${index}.position`}
                    placeholder="Senior Software Engineer"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.position`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Location
                  </label>
                  <Field
                    name={`experiences.${index}.location`}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Start Date *
                  </label>
                  <Field
                    type="date"
                    name={`experiences.${index}.start_date`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.start_date`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    End Date
                  </label>
                  <Field
                    type="date"
                    name={`experiences.${index}.end_date`}
                    disabled={experience.present}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <ErrorMessage
                    name={`experiences.${index}.end_date`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Present Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors">
                    <Field
                      type="checkbox"
                      name={`experiences.${index}.present`}
                      className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-amber-900">
                      Currently working here
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-amber-500 ml-auto" />
                  </label>
                </div>

                {/* Responsibilities */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-amber-500" />
                    Key Responsibilities & Achievements *
                  </label>
                  <FieldArray name={`experiences.${index}.responsibilities`}>
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {experience.responsibilities.map((_, respIndex) => (
                          <motion.div
                            key={respIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-2"
                          >
                            <Field
                              name={`experiences.${index}.responsibilities.${respIndex}`}
                              placeholder="Led a team of 5 developers to deliver project on time"
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => remove(respIndex)}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </motion.div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
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
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Achievements */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Key Achievements (Optional)
                  </label>
                  <FieldArray name={`experiences.${index}.achievements`}>
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {experience.achievements?.map((_, achIndex) => (
                          <motion.div
                            key={achIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-2"
                          >
                            <Field
                              name={`experiences.${index}.achievements.${achIndex}`}
                              placeholder="Increased revenue by 25% through optimization"
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => remove(achIndex)}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </motion.div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
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
    experiences: [
      {
        company_name: "",
        position: "",
        location: "",
        start_date: "",
        end_date: "",
        present: false,
        responsibilities: [""],
        achievements: [],
      },
    ],
    user_id: userId,
  };

  const handleSubmit = async (values: MyFormValues, { setSubmitting }: any) => {
    setIsSubmitting(true);
    try {
      const adjustedValues = values.experiences.map((exp) => ({
        ...exp,
        user_id: userId,
      }));
      await saveDataIntoSupabase("experience_details", adjustedValues);
      onNext();
    } catch (error) {
      console.error("Error saving experience details:", error);
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        </div>
        <p className="text-gray-600">
          Add your work history. Highlight your achievements and responsibilities.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={experienceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleReset }) => (
          <Form className="space-y-6">
            <FieldArray name="experiences">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {values.experiences.map((experience, index) => (
                      <ExperienceCard
                        key={index}
                        index={index}
                        experience={experience}
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
                        canRemove={values.experiences.length > 1}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={() => {
                      push({
                        company_name: "",
                        position: "",
                        location: "",
                        start_date: "",
                        end_date: "",
                        present: false,
                        responsibilities: [""],
                        achievements: [],
                      });
                      setExpandedIndex(values.experiences.length);
                    }}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Experience
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
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ExperienceDetails;
