"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  HandHeart,
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
} from "lucide-react";
import { volunteerSchema } from "../utils/validationSchemas";
import { saveVolunteerDetails, loadVolunteerDetails, clearVolunteerDetails, notifyResumeUpdate } from "../lib/storage";

interface VolunteerExperience {
  organization_name: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  present: boolean;
  contributions: string[];
}

interface VolunteerDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  volunteer_experiences: VolunteerExperience[];
}

let volunteerIdCounter = 0;
const generateVolunteerId = () => `volunteer-${Date.now()}-${volunteerIdCounter++}`;

const VolunteerCard = ({
  index,
  volunteer,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
  volunteerId,
}: {
  index: number;
  volunteer: VolunteerExperience;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
  volunteerId: string;
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
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center">
            <HandHeart className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {volunteer.role || `Volunteer Experience ${index + 1}`}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {volunteer.organization_name || "Click to edit details"}
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

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`content-${volunteerId}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-fuchsia-500" />
                    Organization *
                  </label>
                  <Field
                    name={`volunteer_experiences.${index}.organization_name`}
                    placeholder="Red Cross"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <ErrorMessage
                    name={`volunteer_experiences.${index}.organization_name`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <HandHeart className="w-4 h-4 text-fuchsia-500" />
                    Role *
                  </label>
                  <Field
                    name={`volunteer_experiences.${index}.role`}
                    placeholder="Volunteer Coordinator"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <ErrorMessage
                    name={`volunteer_experiences.${index}.role`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-fuchsia-500" />
                    Location
                  </label>
                  <Field
                    name={`volunteer_experiences.${index}.location`}
                    placeholder="Boston, MA"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-fuchsia-500" />
                    Start Date *
                  </label>
                  <Field
                    type="date"
                    name={`volunteer_experiences.${index}.start_date`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 outline-none transition-all"
                  />
                  <ErrorMessage
                    name={`volunteer_experiences.${index}.start_date`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-fuchsia-500" />
                    End Date
                  </label>
                  <Field
                    type="date"
                    name={`volunteer_experiences.${index}.end_date`}
                    disabled={volunteer.present}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  />
                  <ErrorMessage
                    name={`volunteer_experiences.${index}.end_date`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-500/10 cursor-pointer hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/20 transition-colors">
                    <Field
                      type="checkbox"
                      name={`volunteer_experiences.${index}.present`}
                      className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <span className="text-sm font-medium text-fuchsia-900 dark:text-fuchsia-300">
                      I currently volunteer here
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400 ml-auto" />
                  </label>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-fuchsia-500" />
                    Key Contributions *
                  </label>
                  <FieldArray name={`volunteer_experiences.${index}.contributions`}>
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {volunteer.contributions.map((_, contributionIndex) => (
                          <div key={contributionIndex} className="flex gap-2">
                            <Field
                              name={`volunteer_experiences.${index}.contributions.${contributionIndex}`}
                              placeholder="Organized monthly food drives for 200+ families"
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                            <button
                              type="button"
                              onClick={() => remove(contributionIndex)}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/20 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Contribution
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage
                    name={`volunteer_experiences.${index}.contributions`}
                    component="div"
                    className="text-sm text-red-500 dark:text-red-400"
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

const VolunteerDetails: React.FC<VolunteerDetailsProps> = ({ onNext }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [initialValues, setInitialValues] = useState<MyFormValues>({ volunteer_experiences: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [volunteerIds, setVolunteerIds] = useState<string[]>([]);

  useEffect(() => {
    const savedData = loadVolunteerDetails();
    if (savedData && savedData.length > 0) {
      setInitialValues({ volunteer_experiences: savedData });
      setVolunteerIds(savedData.map(() => generateVolunteerId()));
    } else {
      setInitialValues({ volunteer_experiences: [] });
      setVolunteerIds([]);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = async (values: MyFormValues) => {
    setIsSubmitting(true);
    try {
      saveVolunteerDetails(values.volunteer_experiences);
      notifyResumeUpdate();
      onNext();
    } catch (error) {
      console.error("Error saving volunteer details:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVolunteer = useCallback((push: (obj: VolunteerExperience) => void, length: number) => {
    const newVolunteer: VolunteerExperience = {
      organization_name: "",
      role: "",
      location: "",
      start_date: "",
      end_date: "",
      present: false,
      contributions: [""],
    };
    push(newVolunteer);
    setVolunteerIds((prev) => [...prev, generateVolunteerId()]);
    setExpandedIndex(length);
  }, []);

  const handleRemoveVolunteer = useCallback((remove: (index: number) => void, index: number, values: MyFormValues) => {
    remove(index);
    setVolunteerIds((prev) => prev.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
    const newVolunteer = values.volunteer_experiences.filter((_, i) => i !== index);
    saveVolunteerDetails(newVolunteer);
    notifyResumeUpdate();
  }, [expandedIndex]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center">
            <HandHeart className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Volunteer Experience</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Add volunteer, community, or service work if relevant. You can skip this section.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={volunteerSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({ values, setValues }) => (
          <Form className="space-y-6">
            <FieldArray name="volunteer_experiences">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {values.volunteer_experiences.map((volunteer, index) => (
                      <VolunteerCard
                        key={volunteerIds[index] || index}
                        index={index}
                        volunteer={volunteer}
                        isExpanded={expandedIndex === index}
                        onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                        onRemove={() => handleRemoveVolunteer(remove, index, values)}
                        canRemove={values.volunteer_experiences.length > 0}
                        volunteerId={volunteerIds[index] || String(index)}
                      />
                    ))}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAddVolunteer(push, values.volunteer_experiences.length)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-fuchsia-400 dark:hover:border-fuchsia-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Volunteer Experience
                  </motion.button>
                </div>
              )}
            </FieldArray>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  clearVolunteerDetails();
                  setValues({ volunteer_experiences: [] });
                  setVolunteerIds([]);
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
                    saveVolunteerDetails(values.volunteer_experiences);
                    notifyResumeUpdate();
                  }}
                  className="px-6 py-3 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 rounded-xl transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl hover:from-fuchsia-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default VolunteerDetails;
