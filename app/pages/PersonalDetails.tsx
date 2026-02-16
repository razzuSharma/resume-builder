"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import {
  savePersonalDetails,
  loadPersonalDetails,
  clearPersonalDetails,
  notifyResumeUpdate,
  loadSelectedTemplate,
} from "../lib/storage";
import type { TemplateId } from "../lib/templates";

interface PersonalDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  permanent_address: string;
  nationality: string;
  date_of_birth: string;
  gender: string;
  summary: string;
  declaration_text: string;
  passport_number: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  father_name: string;
  marital_status: string;
  linkedin: string;
  website: string;
  github: string;
  profile_image_url: string;
}

const DEFAULT_VALUES: MyFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  location: "",
  permanent_address: "",
  nationality: "",
  date_of_birth: "",
  gender: "",
  summary: "",
  declaration_text: "",
  passport_number: "",
  passport_issue_date: "",
  passport_expiry_date: "",
  father_name: "",
  marital_status: "",
  linkedin: "",
  website: "",
  github: "",
  profile_image_url: "",
};

const personalDetailsSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  location: Yup.string(),
  permanent_address: Yup.string(),
  nationality: Yup.string(),
  date_of_birth: Yup.string(),
  gender: Yup.string(),
  summary: Yup.string(),
  declaration_text: Yup.string(),
  passport_number: Yup.string(),
  passport_issue_date: Yup.string(),
  passport_expiry_date: Yup.string(),
  father_name: Yup.string(),
  marital_status: Yup.string(),
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
  isTextarea = false,
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
    <ErrorMessage name={name} component="div" className="text-sm text-red-500 dark:text-red-400" />
  </div>
);

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ onNext }) => {
  const CROP_FRAME_WIDTH = 220;
  const CROP_FRAME_HEIGHT = 320;
  const CROP_OUTPUT_WIDTH = 440;
  const CROP_OUTPUT_HEIGHT = 640;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");

  const [showCropper, setShowCropper] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState("");
  const [cropImageSize, setCropImageSize] = useState({ width: 0, height: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);

  const cropDragStartRef = useRef<{ x: number; y: number } | null>(null);
  const cropStartPositionRef = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialValues, setInitialValues] = useState<MyFormValues>({ ...DEFAULT_VALUES });

  useEffect(() => {
    const loadData = () => {
      const savedData = loadPersonalDetails() as MyFormValues | null;
      const storedTemplate = loadSelectedTemplate() as TemplateId;
      setSelectedTemplate(storedTemplate);
      if (savedData) {
        setInitialValues({ ...DEFAULT_VALUES, ...savedData });
        if (savedData.profile_image_url) {
          setPreviewImage(savedData.profile_image_url);
        }
        setLastSaved(new Date());
      }
      setIsLoading(false);
    };

    loadData();

    const handleTemplateUpdate = () => {
      setSelectedTemplate(loadSelectedTemplate() as TemplateId);
    };
    window.addEventListener("resumeTemplateUpdated", handleTemplateUpdate);
    return () => window.removeEventListener("resumeTemplateUpdated", handleTemplateUpdate);
  }, []);

  const clampCropPosition = useCallback((position: { x: number; y: number }, zoomLevel: number) => {
    if (!cropImageSize.width || !cropImageSize.height) return { x: 0, y: 0 };

    const baseScale = Math.max(CROP_FRAME_WIDTH / cropImageSize.width, CROP_FRAME_HEIGHT / cropImageSize.height);
    const displayWidth = cropImageSize.width * baseScale * zoomLevel;
    const displayHeight = cropImageSize.height * baseScale * zoomLevel;
    const maxX = Math.max(0, (displayWidth - CROP_FRAME_WIDTH) / 2);
    const maxY = Math.max(0, (displayHeight - CROP_FRAME_HEIGHT) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, position.x)),
      y: Math.min(maxY, Math.max(-maxY, position.y)),
    };
  }, [cropImageSize, CROP_FRAME_HEIGHT, CROP_FRAME_WIDTH]);

  useEffect(() => {
    if (!showCropper || !isDraggingCrop) return;

    const onMove = (e: MouseEvent) => {
      if (!cropDragStartRef.current) return;
      const next = clampCropPosition(
        {
          x: cropStartPositionRef.current.x + (e.clientX - cropDragStartRef.current.x),
          y: cropStartPositionRef.current.y + (e.clientY - cropDragStartRef.current.y),
        },
        cropZoom
      );
      setCropPosition(next);
    };

    const onUp = () => {
      setIsDraggingCrop(false);
      cropDragStartRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [showCropper, isDraggingCrop, cropZoom, cropImageSize, clampCropPosition]);

  useEffect(() => {
    if (!showCropper) return;
    setCropPosition((prev) => clampCropPosition(prev, cropZoom));
  }, [cropZoom, showCropper, cropImageSize, clampCropPosition]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        setCropSourceImage(result);
        setCropImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        setCropZoom(1);
        setCropPosition({ x: 0, y: 0 });
        setShowCropper(true);
      };
      img.src = result;
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

  const handleCancelCrop = () => {
    setShowCropper(false);
    setCropSourceImage("");
    setCropZoom(1);
    setCropPosition({ x: 0, y: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleApplyCrop = async (setFieldValue: (field: string, value: any) => void, values: MyFormValues) => {
    if (!cropSourceImage || !cropImageSize.width || !cropImageSize.height) return;

    setIsUploading(true);
    try {
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load crop image"));
        img.src = cropSourceImage;
      });

      const baseScale = Math.max(CROP_FRAME_WIDTH / cropImageSize.width, CROP_FRAME_HEIGHT / cropImageSize.height);
      const displayScale = baseScale * cropZoom;
      const displayWidth = cropImageSize.width * displayScale;
      const displayHeight = cropImageSize.height * displayScale;
      const left = CROP_FRAME_WIDTH / 2 + cropPosition.x - displayWidth / 2;
      const top = CROP_FRAME_HEIGHT / 2 + cropPosition.y - displayHeight / 2;

      const sx = Math.max(0, -left / displayScale);
      const sy = Math.max(0, -top / displayScale);
      const sWidth = Math.min(cropImageSize.width - sx, CROP_FRAME_WIDTH / displayScale);
      const sHeight = Math.min(cropImageSize.height - sy, CROP_FRAME_HEIGHT / displayScale);

      const canvas = document.createElement("canvas");
      canvas.width = CROP_OUTPUT_WIDTH;
      canvas.height = CROP_OUTPUT_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to create crop canvas");

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      const cropped = canvas.toDataURL("image/jpeg", 0.92);

      setPreviewImage(cropped);
      setFieldValue("profile_image_url", cropped);
      handleAutoSave({ ...values, profile_image_url: cropped });
      setShowCropper(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Unable to crop this image. Please try a different one.");
    } finally {
      setIsUploading(false);
    }
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

  const isEuropass = selectedTemplate === "europass";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
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
          {isEuropass
            ? "Fill this section for Europass. Europass-specific fields and photo are shown below."
            : "Let&apos;s start with your basic information. This will be the header of your resume."}
        </p>
      </div>

      <Formik initialValues={initialValues} validationSchema={personalDetailsSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, setFieldValue, isValid }) => {
          const handleClearData = () => {
            clearPersonalDetails();
            Object.keys(DEFAULT_VALUES).forEach((key) => {
              setFieldValue(key, "");
            });
            setPreviewImage("");
            setLastSaved(null);
          };

          return (
            <Form className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {isEuropass && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                        <Camera className="w-4 h-4 text-teal-500" />
                        Profile Photo (Europass)
                      </label>
                      <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                            {previewImage ? (
                              <Image src={previewImage} alt="Profile preview" width={80} height={96} className="w-full h-full object-cover" />
                            ) : (
                              <Camera className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-image-upload" />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              Upload Photo
                            </button>
                            {previewImage && (
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(setFieldValue)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">JPG/PNG, max 2MB. Upload opens a crop editor before saving the photo.</p>
                      </div>
                    </div>
                  )}

                  <InputField label="First Name *" name="first_name" placeholder="John" icon={User} />
                  <InputField label="Last Name *" name="last_name" placeholder="Doe" icon={User} />
                  <InputField label="Email Address *" name="email" type="email" placeholder="john@example.com" icon={Mail} />
                  <InputField label="Phone Number *" name="phone" type="tel" placeholder="+1 (555) 123-4567" icon={Phone} />
                  <InputField label="Location" name="location" placeholder="City, Country" icon={MapPin} />

                  {isEuropass && (
                    <>
                      <InputField label="Permanent Address" name="permanent_address" placeholder="Street, City, Region, Country" icon={MapPin} />
                      <InputField label="Nationality" name="nationality" placeholder="Nepalese" icon={User} />
                      <InputField label="Date of Birth" name="date_of_birth" type="date" icon={User} />
                      <InputField label="Gender" name="gender" placeholder="Male / Female / Other" icon={User} />
                    </>
                  )}

                  <InputField label="GitHub URL" name="github" type="url" placeholder="https://github.com/johndoe" icon={Github} />
                  <InputField label="LinkedIn URL" name="linkedin" type="url" placeholder="https://linkedin.com/in/johndoe" icon={Linkedin} />
                  <InputField label="Personal Website / Portfolio" name="website" type="url" placeholder="https://johndoe.com" icon={Globe} />

                  {isEuropass && (
                    <>
                      <InputField label="Passport Number" name="passport_number" placeholder="PA2707467" icon={FileText} />
                      <InputField label="Passport Issue Date" name="passport_issue_date" type="date" icon={FileText} />
                      <InputField label="Passport Expiry Date" name="passport_expiry_date" type="date" icon={FileText} />
                      <InputField label="Father's Name" name="father_name" placeholder="Father's full name" icon={User} />
                      <InputField label="Marital Status" name="marital_status" placeholder="Single / Married" icon={User} />
                    </>
                  )}

                  <div className="md:col-span-2">
                    <InputField
                      label="Professional Summary"
                      name="summary"
                      placeholder="Write a brief summary about yourself, your experience, and your career goals..."
                      icon={FileText}
                      isTextarea
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This appears at the top of your resume. Keep it concise and impactful.</p>
                  </div>

                  {isEuropass && (
                    <div className="md:col-span-2">
                      <InputField
                        label="Declaration"
                        name="declaration_text"
                        placeholder="I declare that the information given above is true to the best of my knowledge."
                        icon={FileText}
                        isTextarea
                      />
                    </div>
                  )}
                </div>
              </div>

              {showCropper && (
                <div className="fixed inset-0 z-[60] bg-black/50 p-4 flex items-center justify-center">
                  <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Crop Profile Photo</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Drag to move and use zoom to fit the photo into the Europass frame.</p>

                    <div className="flex justify-center mb-4">
                      <div
                        style={{
                          width: `${CROP_FRAME_WIDTH}px`,
                          height: `${CROP_FRAME_HEIGHT}px`,
                          overflow: "hidden",
                          borderRadius: "16px",
                          border: "2px solid #94a3b8",
                          position: "relative",
                          backgroundColor: "#e5e7eb",
                          cursor: isDraggingCrop ? "grabbing" : "grab",
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsDraggingCrop(true);
                          cropDragStartRef.current = { x: e.clientX, y: e.clientY };
                          cropStartPositionRef.current = cropPosition;
                        }}
                      >
                        {cropSourceImage && (
                          <Image
                            src={cropSourceImage}
                            alt="Crop preview"
                            width={Math.round(cropImageSize.width * Math.max(CROP_FRAME_WIDTH / Math.max(cropImageSize.width, 1), CROP_FRAME_HEIGHT / Math.max(cropImageSize.height, 1)))}
                            height={Math.round(cropImageSize.height * Math.max(CROP_FRAME_WIDTH / Math.max(cropImageSize.width, 1), CROP_FRAME_HEIGHT / Math.max(cropImageSize.height, 1)))}
                            unoptimized
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              width: `${cropImageSize.width * Math.max(CROP_FRAME_WIDTH / Math.max(cropImageSize.width, 1), CROP_FRAME_HEIGHT / Math.max(cropImageSize.height, 1))}px`,
                              height: `${cropImageSize.height * Math.max(CROP_FRAME_WIDTH / Math.max(cropImageSize.width, 1), CROP_FRAME_HEIGHT / Math.max(cropImageSize.height, 1))}px`,
                              transform: `translate(calc(-50% + ${cropPosition.x}px), calc(-50% + ${cropPosition.y}px)) scale(${cropZoom})`,
                              transformOrigin: "center",
                              pointerEvents: "none",
                              userSelect: "none",
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Zoom</label>
                      <input type="range" min={1} max={3} step={0.01} value={cropZoom} onChange={(e) => setCropZoom(Number(e.target.value))} className="w-full" />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelCrop}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCrop(setFieldValue, values)}
                        className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
                      >
                        Apply Crop
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
