"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import {
  Wand2,
  Plus,
  X,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { skillsSchema } from "../utils/validationSchemas";
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

interface SkillsDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  skills: string[];
  user_id?: string;
}

const suggestedSkills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
  "SQL", "Git", "AWS", "Docker", "Figma", "HTML/CSS", "Tailwind CSS",
  "GraphQL", "REST APIs", "MongoDB", "PostgreSQL", "Redux"
];

const SkillsDetails: React.FC<SkillsDetailsProps> = ({ onNext }) => {
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const initialValues: MyFormValues = {
    skills: [],
    user_id: userId,
  };

  const handleSubmit = async (values: MyFormValues, { setSubmitting }: any) => {
    if (values.skills.length === 0) {
      alert("Please add at least one skill");
      setSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      // Save skills as JSON string
      const dataToSave = {
        skills: JSON.stringify(values.skills),
        user_id: userId,
      };
      await saveDataIntoSupabase("skills", dataToSave);
      onNext();
    } catch (error) {
      console.error("Error saving skills:", error);
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        </div>
        <p className="text-gray-600">
          Add your technical and professional skills. These help recruiters find you.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={skillsSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleReset, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              {/* Add Skill Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Add a Skill
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newSkill.trim() && !values.skills.includes(newSkill.trim())) {
                          setFieldValue("skills", [...values.skills, newSkill.trim()]);
                          setNewSkill("");
                        }
                      }
                    }}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSkill.trim() && !values.skills.includes(newSkill.trim())) {
                        setFieldValue("skills", [...values.skills, newSkill.trim()]);
                        setNewSkill("");
                      }
                    }}
                    disabled={!newSkill.trim() || values.skills.includes(newSkill.trim())}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <FieldArray name="skills">
                {({ remove }) => (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Your Skills ({values.skills.length})
                    </label>
                    {values.skills.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Wand2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No skills added yet</p>
                        <p className="text-sm text-gray-400">
                          Add skills above or select from suggestions below
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {values.skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    <ErrorMessage
                      name="skills"
                      component="div"
                      className="text-sm text-red-500 mt-2"
                    />
                  </div>
                )}
              </FieldArray>

              {/* Suggested Skills */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Suggested Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills
                    .filter((skill) => !values.skills.includes(skill))
                    .map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() =>
                          setFieldValue("skills", [...values.skills, skill])
                        }
                        className="px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                </div>
              </div>

              {/* Quick Actions */}
              {values.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{values.skills.length} skills added</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFieldValue("skills", [])}
                      className="text-red-500 hover:text-red-600 ml-auto"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                disabled={isSubmitting || values.skills.length === 0}
                className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SkillsDetails;
