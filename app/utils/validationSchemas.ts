import * as Yup from "yup";

// Custom URL validator that accepts URLs with or without protocol
const isValidUrl = (value: string | undefined): boolean => {
  if (!value || value === "") return true;
  
  // Accept domain-like patterns: example.com, www.example.com, sub.example.com
  // Also accept URLs with protocols: http://example.com, https://example.com
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  
  // Accept github.com/username or linkedin.com/in/username patterns
  const simplePattern = /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
  
  return urlPattern.test(value) || simplePattern.test(value);
};

// Personal Details Schema
export const personalDetailsSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, "Invalid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  location: Yup.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  summary: Yup.string()
    .max(1000, "Summary must be less than 1000 characters")
    .optional(),
  linkedin: Yup.string()
    .test("is-valid-url", "Enter a valid URL (e.g., linkedin.com/in/username)", isValidUrl)
    .optional(),
  website: Yup.string()
    .test("is-valid-url", "Enter a valid URL (e.g., mywebsite.com)", isValidUrl)
    .optional(),
  github: Yup.string()
    .test("is-valid-url", "Enter a valid URL (e.g., github.com/username)", isValidUrl)
    .optional(),
  profile_image_url: Yup.string()
    .test("is-valid-url", "Enter a valid image URL", isValidUrl)
    .optional(),
});

// Education Schema
export const educationSchema = Yup.object({
  educations: Yup.array().of(
    Yup.object({
      school_name: Yup.string()
        .min(2, "School name must be at least 2 characters")
        .required("School name is required"),
      degree: Yup.string()
        .min(2, "Degree must be at least 2 characters")
        .required("Degree is required"),
      field_of_study: Yup.string()
        .min(2, "Field of study must be at least 2 characters")
        .required("Field of study is required"),
      start_date: Yup.date()
        .required("Start date is required"),
      end_date: Yup.date()
        .when("present", {
          is: true,
          then: () => Yup.date().nullable(),
          otherwise: () => Yup.date()
            .min(Yup.ref("start_date"), "End date must be after start date")
            .nullable(),
        }),
      present: Yup.boolean(),
      gpa: Yup.string().optional(),
      description: Yup.string().optional(),
      certificate_url: Yup.string().url("Invalid URL").optional(),
    })
  ).min(1, "At least one education entry is required"),
});

// Experience Schema
export const experienceSchema = Yup.object({
  experiences: Yup.array().of(
    Yup.object({
      company_name: Yup.string()
        .min(2, "Company name must be at least 2 characters")
        .required("Company name is required"),
      position: Yup.string()
        .min(2, "Position must be at least 2 characters")
        .required("Position is required"),
      location: Yup.string().optional(),
      start_date: Yup.date()
        .required("Start date is required"),
      end_date: Yup.date()
        .when("present", {
          is: true,
          then: () => Yup.date().nullable(),
          otherwise: () => Yup.date()
            .min(Yup.ref("start_date"), "End date must be after start date")
            .nullable(),
        }),
      present: Yup.boolean(),
      responsibilities: Yup.array()
        .of(Yup.string())
        .min(1, "At least one responsibility is required"),
      achievements: Yup.array()
        .of(Yup.string())
        .optional(),
    })
  ),
});

// Project Schema
export const projectSchema = Yup.object({
  projects: Yup.array().of(
    Yup.object({
      name: Yup.string()
        .min(2, "Title must be at least 2 characters")
        .required("Title is required"),
      start_date: Yup.date()
        .required("Start date is required"),
      end_date: Yup.date()
        .when("present", {
          is: true,
          then: () => Yup.date().nullable(),
          otherwise: () => Yup.date()
            .min(Yup.ref("start_date"), "End date must be after start date")
            .nullable(),
        }),
      present: Yup.boolean(),
      link: Yup.string()
        .test("is-valid-url", "Enter a valid URL", isValidUrl)
        .optional(),
      github_link: Yup.string()
        .test("is-valid-url", "Enter a valid URL", isValidUrl)
        .optional(),
      role: Yup.string()
        .max(120, "Role must be less than 120 characters")
        .optional(),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .required("Description is required"),
      outcome: Yup.string()
        .max(300, "Outcome must be less than 300 characters")
        .optional(),
      technologies: Yup.array()
        .of(Yup.string())
        .optional(),
    })
  ),
});

// Volunteer Schema
export const volunteerSchema = Yup.object({
  volunteer_experiences: Yup.array().of(
    Yup.object({
      organization_name: Yup.string()
        .min(2, "Organization name must be at least 2 characters")
        .required("Organization name is required"),
      role: Yup.string()
        .min(2, "Role must be at least 2 characters")
        .required("Role is required"),
      location: Yup.string().optional(),
      start_date: Yup.date()
        .required("Start date is required"),
      end_date: Yup.date()
        .when("present", {
          is: true,
          then: () => Yup.date().nullable(),
          otherwise: () => Yup.date()
            .min(Yup.ref("start_date"), "End date must be after start date")
            .nullable(),
        }),
      present: Yup.boolean(),
      contributions: Yup.array()
        .of(Yup.string())
        .min(1, "At least one contribution is required"),
    })
  ),
});

// Skills Schema
export const skillsSchema = Yup.object({
  skills: Yup.array()
    .of(
      Yup.string()
        .min(1, "Skill cannot be empty")
        .max(50, "Skill must be less than 50 characters")
    )
    .min(1, "At least one skill is required")
    .max(30, "Maximum 30 skills allowed"),
});

// Hobbies Schema
export const hobbiesSchema = Yup.object({
  hobbies: Yup.array()
    .of(
      Yup.string()
        .min(2, "Hobby must be at least 2 characters")
        .max(50, "Hobby must be less than 50 characters")
    )
    .min(1, "At least one hobby is required")
    .max(15, "Maximum 15 hobbies allowed"),
});

// Certification Schema
export const certificationSchema = Yup.object({
  certifications: Yup.array().of(
    Yup.object({
      name: Yup.string()
        .min(2, "Certification name must be at least 2 characters")
        .required("Certification name is required"),
      issuing_organization: Yup.string()
        .min(2, "Organization name must be at least 2 characters")
        .required("Issuing organization is required"),
      issue_date: Yup.date().optional(),
      expiry_date: Yup.date().optional(),
      credential_id: Yup.string().optional(),
      credential_url: Yup.string().url("Invalid URL").optional(),
    })
  ),
});

// Language Schema
export const languageSchema = Yup.object({
  languages: Yup.array().of(
    Yup.object({
      language: Yup.string()
        .min(2, "Language must be at least 2 characters")
        .required("Language is required"),
      proficiency: Yup.string()
        .oneOf(['Native', 'Fluent', 'Conversational', 'Basic'], "Invalid proficiency level")
        .required("Proficiency level is required"),
    })
  ),
});

// File Upload Schema
export const fileUploadSchema = Yup.object({
  file: Yup.mixed()
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true;
      return (value as File).size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      return allowedTypes.includes((value as File).type);
    })
    .optional(),
});
