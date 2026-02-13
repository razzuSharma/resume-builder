"use client";

import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github,
  Globe, 
  FileText,
  ArrowRight,
  RotateCcw,
  Camera,
  Upload,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import * as Yup from "yup";
import { savePersonalDetails, loadPersonalDetails, clearPersonalDetails, notifyResumeUpdate } from "../lib/storage";

interface PersonalDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  website: string;
  github: string;
  profile_image_url: string;
}

const personalDetailsSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  location: Yup.string(),
  summary: Yup.string(),
  linkedin: Yup.string().url("Invalid URL"),
  website: Yup.string().url("Invalid URL"),
  github: Yup.string().url("Invalid URL"),
  profile_image_url: Yup.string(),
});

const InputField = ({ 
  label, 
  name, 
  type = "text", 
  placeholder = "",
  icon: Icon,
  isTextarea = false
}: { 
  label: string; 
  name: string; 
  type?: string; 
  placeholder?: string;
  icon: React.ElementType;
  isTextarea?: boolean;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
      <Icon className="w-4 h-4 text-teal-500" />
      {label}
    </label>
    {isTextarea ? (
      <Field
        as="textarea"
        name={name}
        id={name}
        rows={4}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
    ) : (
      <Field
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
    )}
    <ErrorMessage
      name={name}
      component="div"
      className="text-sm text-red-500 dark:text-red-400"
    />
  </div>
);

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ onNext }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [initialValues, setInitialValues] = useState<MyFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    linkedin: "",
    website: "",
    github: "",
    profile_image_url: "",
  });

  // Load existing data
  useEffect(() => {
    const loadData = () => {
      const savedData = loadPersonalDetails() as MyFormValues | null;
      if (savedData) {
        setInitialValues(savedData);
        if (savedData.profile_image_url) {
          setPreviewImage(savedData.profile_image_url);
        }
        setLastSaved(new Date());
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setFieldValue("profile_image_url", result);
      // Auto-save when image changes
      handleAutoSave({ ...initialValues, profile_image_url: result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (setFieldValue: (field: string, value: any) => void) => {
    setPreviewImage("");
    setFieldValue("profile_image_url", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAutoSave = (values: MyFormValues) => {
    savePersonalDetails(values);
    setLastSaved(new Date());
    notifyResumeUpdate();
  };

  const handleSubmit = async (values: MyFormValues) => {
    setIsSubmitting(true);
    try {
      savePersonalDetails(values);
      notifyResumeUpdate();
      onNext();
    } catch (error) {
      console.error("Error saving personal details:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Details</h2>
              {lastSaved && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Last saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Let&apos;s start with your basic information. This will be the header of your resume.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={personalDetailsSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid }) => {
                const handleClearData = () => {
                  // Clear from localStorage
                  clearPersonalDetails();
                  // Reset all form fields to empty string
                  setFieldValue("first_name", "");
                  setFieldValue("last_name", "");
                  setFieldValue("email", "");
                  setFieldValue("phone", "");
                  setFieldValue("location", "");
                  setFieldValue("summary", "");
                  setFieldValue("linkedin", "");
                  setFieldValue("website", "");
                  setFieldValue("github", "");
                  setFieldValue("profile_image_url", "");
                  // Clear preview image
                  setPreviewImage("");
                  // Clear last saved indicator
                  setLastSaved(null);
                };

                return (
          <Form className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <InputField
                  label="First Name *"
                  name="first_name"
                  placeholder="John"
                  icon={User}
                />

                {/* Last Name */}
                <InputField
                  label="Last Name *"
                  name="last_name"
                  placeholder="Doe"
                  icon={User}
                />

                {/* Email */}
                <InputField
                  label="Email Address *"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  icon={Mail}
                />

                {/* Phone */}
                <InputField
                  label="Phone Number *"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  icon={Phone}
                />

                {/* Location */}
                <InputField
                  label="Location"
                  name="location"
                  placeholder="City, Country"
                  icon={MapPin}
                />

                {/* GitHub */}
                <InputField
                  label="GitHub URL"
                  name="github"
                  type="url"
                  placeholder="https://github.com/johndoe"
                  icon={Github}
                />

                {/* LinkedIn */}
                <InputField
                  label="LinkedIn URL"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/johndoe"
                  icon={Linkedin}
                />

                {/* Website */}
                <InputField
                  label="Personal Website / Portfolio"
                  name="website"
                  type="url"
                  placeholder="https://johndoe.com"
                  icon={Globe}
                />

                {/* Summary */}
                <div className="md:col-span-2">
                  <InputField
                    label="Professional Summary"
                    name="summary"
                    placeholder="Write a brief summary about yourself, your experience, and your career goals..."
                    icon={FileText}
                    isTextarea
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This appears at the top of your resume. Keep it concise and impactful.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleClearData}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAutoSave(values)}
                  className="px-6 py-3 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-xl transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading || !isValid}
                  className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
                );
              }}
      </Formik>
    </motion.div>
  );
};

export default PersonalDetails;
