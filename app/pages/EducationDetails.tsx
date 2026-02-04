"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  Building2,
  BookOpen,
  Plus,
  Trash2,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Award,
  FileText
} from "lucide-react";
import { educationSchema } from "../utils/validationSchemas";
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

interface Education {
  school_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  present: boolean;
  gpa: string;
  description: string;
  certificate_url: string;
}

interface EducationDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  educations: Education[];
  user_id?: string;
}

const EducationCard = ({
  index,
  education,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
}: {
  index: number;
  education: Education;
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {education.school_name || `Education ${index + 1}`}
            </h3>
            <p className="text-sm text-gray-500">
              {education.degree || "Click to edit details"}
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
                {/* School Name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-500" />
                    School / University *
                  </label>
                  <Field
                    name={`educations.${index}.school_name`}
                    placeholder="Harvard University"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`educations.${index}.school_name`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Degree */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    Degree *
                  </label>
                  <Field
                    name={`educations.${index}.degree`}
                    placeholder="Bachelor of Science"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`educations.${index}.degree`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Field of Study */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    Field of Study *
                  </label>
                  <Field
                    name={`educations.${index}.field_of_study`}
                    placeholder="Computer Science"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`educations.${index}.field_of_study`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Start Date *
                  </label>
                  <Field
                    type="date"
                    name={`educations.${index}.start_date`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`educations.${index}.start_date`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    End Date
                  </label>
                  <Field
                    type="date"
                    name={`educations.${index}.end_date`}
                    disabled={education.present}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <ErrorMessage
                    name={`educations.${index}.end_date`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Present Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors">
                    <Field
                      type="checkbox"
                      name={`educations.${index}.present`}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-purple-900">
                      Currently studying here
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-purple-500 ml-auto" />
                  </label>
                </div>

                {/* GPA */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    GPA (Optional)
                  </label>
                  <Field
                    name={`educations.${index}.gpa`}
                    placeholder="3.8 / 4.0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Description (Optional)
                  </label>
                  <Field
                    as="textarea"
                    name={`educations.${index}.description`}
                    rows={3}
                    placeholder="Notable achievements, activities, etc."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
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

const EducationDetails: React.FC<EducationDetailsProps> = ({ onNext }) => {
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
    educations: [
      {
        school_name: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        present: false,
        gpa: "",
        description: "",
        certificate_url: "",
      },
    ],
    user_id: userId,
  };

  const handleSubmit = async (values: MyFormValues, { setSubmitting }: any) => {
    setIsSubmitting(true);
    try {
      const adjustedValues = values.educations.map((education) => ({
        ...education,
        user_id: userId,
      }));
      await saveDataIntoSupabase("education_details", adjustedValues);
      onNext();
    } catch (error) {
      console.error("Error saving education details:", error);
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        </div>
        <p className="text-gray-600">
          Add your educational background. You can add multiple institutions.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={educationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleReset }) => (
          <Form className="space-y-6">
            <FieldArray name="educations">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {values.educations.map((education, index) => (
                      <EducationCard
                        key={index}
                        index={index}
                        education={education}
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
                        canRemove={values.educations.length > 1}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={() => {
                      push({
                        school_name: "",
                        degree: "",
                        field_of_study: "",
                        start_date: "",
                        end_date: "",
                        present: false,
                        gpa: "",
                        description: "",
                        certificate_url: "",
                      });
                      setExpandedIndex(values.educations.length);
                    }}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Education
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
                className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EducationDetails;
