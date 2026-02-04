import { getSupabaseClient } from "./supabaseClient";
import type { StorageBucket, UploadedFile } from "../types";

const supabase = getSupabaseClient();

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param file - The file to upload
 * @param path - Optional custom path (defaults to filename with timestamp)
 * @returns The uploaded file data or null on error
 */
export const uploadFile = async (
  bucket: StorageBucket,
  file: File,
  path?: string
): Promise<UploadedFile | null> => {
  if (!supabase) {
    console.warn("Supabase not initialized, cannot upload file");
    return null;
  }

  try {
    // Generate unique filename if path not provided
    const fileExt = file.name.split('.').pop();
    const fileName = path || `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading file to ${bucket}:`, error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log(`File uploaded successfully to ${bucket}:`, publicUrl);
    
    return {
      path: data.path,
      publicUrl,
    };
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    return null;
  }
};

/**
 * Upload a base64 image to Supabase Storage
 * @param bucket - The storage bucket name
 * @param base64Data - The base64 encoded image data
 * @param fileName - The desired filename
 * @returns The uploaded file data or null on error
 */
export const uploadBase64Image = async (
  bucket: StorageBucket,
  base64Data: string,
  fileName: string
): Promise<UploadedFile | null> => {
  if (!supabase) {
    console.warn("Supabase not initialized, cannot upload file");
    return null;
  }

  try {
    // Convert base64 to blob
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();

    // Upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: blob.type,
      });

    if (error) {
      console.error(`Error uploading base64 image to ${bucket}:`, error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log(`Base64 image uploaded successfully to ${bucket}:`, publicUrl);
    
    return {
      path: data.path,
      publicUrl,
    };
  } catch (error: any) {
    console.error("Error uploading base64 image:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    return null;
  }
};

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path to delete
 */
export const deleteFile = async (
  bucket: StorageBucket,
  path: string
): Promise<void> => {
  if (!supabase) {
    console.warn("Supabase not initialized, cannot delete file");
    return;
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error(`Error deleting file from ${bucket}:`, error);
      throw error;
    }

    console.log(`File deleted successfully from ${bucket}:`, path);
  } catch (error: any) {
    console.error("Error deleting file:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};

/**
 * Get public URL for a file
 * @param bucket - The storage bucket name
 * @param path - The file path
 * @returns The public URL
 */
export const getPublicUrl = (
  bucket: StorageBucket,
  path: string
): string => {
  if (!supabase) {
    return '';
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
};

/**
 * List all files in a bucket
 * @param bucket - The storage bucket name
 * @param prefix - Optional path prefix to filter
 * @returns Array of file objects
 */
export const listFiles = async (
  bucket: StorageBucket,
  prefix?: string
): Promise<any[]> => {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix);

    if (error) {
      console.error(`Error listing files in ${bucket}:`, error);
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Error listing files:", error.message);
    return [];
  }
};

/**
 * Upload profile image
 * @param file - The image file
 * @param userId - The user ID
 * @returns The uploaded file data
 */
export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<UploadedFile | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `profiles/${userId}_${Date.now()}.${fileExt}`;
  return uploadFile('profiles', file, fileName);
};

/**
 * Upload resume PDF
 * @param file - The PDF file
 * @param userId - The user ID
 * @returns The uploaded file data
 */
export const uploadResumePDF = async (
  file: File,
  userId: string
): Promise<UploadedFile | null> => {
  const fileName = `resumes/${userId}_${Date.now()}.pdf`;
  return uploadFile('resumes', file, fileName);
};

/**
 * Upload project image
 * @param file - The image file
 * @param projectId - The project ID
 * @returns The uploaded file data
 */
export const uploadProjectImage = async (
  file: File,
  projectId: string
): Promise<UploadedFile | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `projects/${projectId}_${Date.now()}.${fileExt}`;
  return uploadFile('projects', file, fileName);
};

/**
 * Upload certificate image
 * @param file - The certificate file
 * @param certificationId - The certification ID
 * @returns The uploaded file data
 */
export const uploadCertificate = async (
  file: File,
  certificationId: string
): Promise<UploadedFile | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `certificates/${certificationId}_${Date.now()}.${fileExt}`;
  return uploadFile('certificates', file, fileName);
};

/**
 * Validate file before upload
 * @param file - The file to validate
 * @param options - Validation options
 * @returns Validation result
 */
export const validateFile = (
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSizeMB = 5, allowedTypes } = options;

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be: ${allowedTypes.join(', ')}`,
      };
    }
  }

  return { valid: true };
};

// File type constants
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const ALLOWED_PDF_TYPES = ['application/pdf'];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
];
