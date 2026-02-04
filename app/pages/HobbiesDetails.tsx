"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import {
  Heart,
  Plus,
  X,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Gamepad2,
  BookOpen,
  Music,
  Camera,
  Plane,
  Palette,
  Dumbbell,
  ChefHat
} from "lucide-react";
import { hobbiesSchema } from "../utils/validationSchemas";
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

interface HobbiesDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  hobbies: string[];
  user_id?: string;
}

const suggestedHobbies = [
  { name: "Reading", icon: BookOpen },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Music", icon: Music },
  { name: "Photography", icon: Camera },
  { name: "Traveling", icon: Plane },
  { name: "Painting", icon: Palette },
  { name: "Fitness", icon: Dumbbell },
  { name: "Cooking", icon: ChefHat },
];

const HobbiesDetails: React.FC<HobbiesDetailsProps> = ({ onNext }) => {
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newHobby, setNewHobby] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const initialValues: MyFormValues = {
    hobbies: [],
    user_id: userId,
  };

  const handleSubmit = async (values: MyFormValues, { setSubmitting }: any) => {
    if (values.hobbies.length === 0) {
      alert("Please add at least one hobby");
      setSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      // Save hobbies as JSON string
      const dataToSave = {
        hobbies: JSON.stringify(values.hobbies),
        user_id: userId,
      };
      await saveDataIntoSupabase("hobbies", dataToSave);
      onNext();
    } catch (error) {
      console.error("Error saving hobbies:", error);
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Hobbies & Interests</h2>
        </div>
        <p className="text-gray-600">
          Share your personal interests. They add personality to your resume and conversation starters.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={hobbiesSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleReset, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              {/* Add Hobby Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Add a Hobby
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newHobby.trim() && !values.hobbies.includes(newHobby.trim())) {
                          setFieldValue("hobbies", [...values.hobbies, newHobby.trim()]);
                          setNewHobby("");
                        }
                      }
                    }}
                    placeholder="Type a hobby and press Enter..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newHobby.trim() && !values.hobbies.includes(newHobby.trim())) {
                        setFieldValue("hobbies", [...values.hobbies, newHobby.trim()]);
                        setNewHobby("");
                      }
                    }}
                    disabled={!newHobby.trim() || values.hobbies.includes(newHobby.trim())}
                    className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Hobbies List */}
              <FieldArray name="hobbies">
                {({ remove }) => (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Your Hobbies ({values.hobbies.length})
                    </label>
                    {values.hobbies.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No hobbies added yet</p>
                        <p className="text-sm text-gray-400">
                          Add hobbies above or select from suggestions below
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {values.hobbies.map((hobby, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-sm font-medium"
                          >
                            {hobby}
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
                      name="hobbies"
                      component="div"
                      className="text-sm text-red-500 mt-2"
                    />
                  </div>
                )}
              </FieldArray>

              {/* Suggested Hobbies */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Popular Hobbies
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedHobbies
                    .filter((hobby) => !values.hobbies.includes(hobby.name))
                    .map((hobby) => {
                      const Icon = hobby.icon;
                      return (
                        <button
                          key={hobby.name}
                          type="button"
                          onClick={() =>
                            setFieldValue("hobbies", [...values.hobbies, hobby.name])
                          }
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-lg text-sm transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          + {hobby.name}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Quick Actions */}
              {values.hobbies.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{values.hobbies.length} hobbies added</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFieldValue("hobbies", [])}
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
                disabled={isSubmitting || values.hobbies.length === 0}
                className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Finish & View Resume
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

export default HobbiesDetails;
