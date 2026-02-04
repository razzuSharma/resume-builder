"use client";

import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { v4 as uuidv4 } from "uuid";
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
  Loader2
} from "lucide-react";
import Image from "next/image";
import { personalDetailsSchema } from "../utils/validationSchemas";
import { saveDataIntoSupabase, fetchDataFromTable } from "../utils/supabaseUtils";
import { uploadProfileImage, validateFile, ALLOWED_IMAGE_TYPES } from "../utils/fileUpload";

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
  user_id?: string;
}

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
    <label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200 resize-none"
      />
    ) : (
      <Field
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
      />
    )}
    <ErrorMessage
      name={name}
      component="div"
      className="text-sm text-red-500"
    />
  </div>
);

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ onNext }) => {
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>("");
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
    user_id: "",
  });

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      let storedUserId = localStorage.getItem("user_id");
      if (!storedUserId) {
        storedUserId = uuidv4();
        localStorage.setItem("user_id", storedUserId);
      }
      setUserId(storedUserId);

      // Try to fetch existing data
      const existingData = await fetchDataFromTable("personal_details", storedUserId);
      if (existingData && existingData.length > 0) {
        const data = existingData[0];
        setInitialValues({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          summary: data.summary || "",
          linkedin: data.linkedin || "",
          website: data.website || "",
          github: data.github || "",
          profile_image_url: data.profile_image_url || "",
          user_id: storedUserId,
        });
        if (data.profile_image_url) {
          setPreviewImage(data.profile_image_url);
        }
      } else {
        setInitialValues(prev => ({ ...prev, user_id: storedUserId || "" }));
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, {
      maxSizeMB: 2,
      allowedTypes: ALLOWED_IMAGE_TYPES,
    });

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const result = await uploadProfileImage(file, userId);
      if (result) {
        setFieldValue("profile_image_url", result.publicUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (setFieldValue: (field: string, value: any) => void) => {
    setPreviewImage("");
    setFieldValue("profile_image_url", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values: MyFormValues, { setSubmitting }: any) => {
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...values,
        user_id: userId,
      };

      await saveDataIntoSupabase("personal_details", dataToSave);
      onNext();
    } catch (error) {
      console.error("Error saving personal details:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        </div>
        <p className="text-gray-600 ml-13">
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
        {({ handleReset, values, setFieldValue, isValid }) => (
          <Form className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              {/* Profile Image Upload */}
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-500" />
                  Profile Photo
                </label>
                
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-teal-300">
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt="Profile preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-teal-400" />
                      )}
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                      </div>
                    )}

                    {previewImage && !isUploading && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(setFieldValue)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {previewImage ? "Change Photo" : "Upload Photo"}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG, GIF up to 2MB
                    </p>
                  </div>
                </div>
              </div>

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
                  <p className="text-xs text-gray-500 mt-1">
                    This appears at the top of your resume. Keep it concise and impactful.
                  </p>
                </div>
              </div>
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
                disabled={isSubmitting || isUploading || !isValid}
                className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isUploading ? "Uploading..." : "Saving..."}
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

export default PersonalDetails;
