import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Get a Supabase client instance
 * Returns null if Supabase credentials are not configured
 */
export const getSupabaseClient = () => {
  try {
    return createClientComponentClient();
  } catch (error) {
    console.warn("Supabase client creation failed - credentials not configured");
    return null;
  }
};

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
         !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Default export for backward compatibility
export default getSupabaseClient;
