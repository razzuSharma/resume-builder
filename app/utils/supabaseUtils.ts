import { getSupabaseClient } from "./supabaseClient";

const supabase = getSupabaseClient();

/**
 * Save data into a Supabase table
 * Handles both single record tables (skills, hobbies) and multi-record tables (education, experience, projects)
 * @param tableName - The name of the table
 * @param data - The data to insert/update
 * @returns The inserted data or undefined
 */
export const saveDataIntoSupabase = async (tableName: string, data: any) => {
  try {
    if (!supabase) {
      throw new Error("[Supabase] Client not initialized");
    }

    // Handle both single objects and arrays
    const dataToInsert = Array.isArray(data) ? data : [data];
    
    // Remove any undefined values
    const cleanData = dataToInsert.map(item => {
      const cleaned: any = {};
      Object.keys(item).forEach(key => {
        if (item[key] !== undefined) {
          cleaned[key] = item[key];
        }
      });
      return cleaned;
    });

    // For tables that can have multiple entries per user, we delete first then insert
    const multiRecordTables = ['education_details', 'experience_details', 'project_details'];
    
    if (multiRecordTables.includes(tableName) && cleanData.length > 0) {
      const userId = cleanData[0].user_id;
      if (userId) {
        // Delete existing records for this user
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .eq('user_id', userId);
        
        if (deleteError) {
          console.warn(`Warning: Could not delete existing ${tableName}:`, deleteError);
        }
      }
    }
    
    const isMultiRecordTable = multiRecordTables.includes(tableName);

    // For multi-record tables we do delete + insert.
    // For single-record tables we do an upsert on user_id.
    const query = isMultiRecordTable
      ? supabase.from(tableName).insert(cleanData)
      : supabase
          .from(tableName)
          .upsert(cleanData, {
            onConflict: "user_id",
            ignoreDuplicates: false,
          });

    // Ask PostgREST to return inserted rows (otherwise `data` is often null).
    const { data: insertedData, error } = await query.select();

    if (error) {
      console.error(`Error inserting data into ${tableName}:`, error);
      throw new Error(`Error inserting data: ${error.message}`);
    }

    console.log(`Data inserted successfully into ${tableName}:`, insertedData);
    return insertedData;
  } catch (error: any) {
    console.error("Error inserting data:", error.message);
    throw error;
  }
};

/**
 * Delete data from a Supabase table
 * @param tableName - The name of the table
 * @param userId - The user ID to filter by
 */
export const deleteDataFromSupabase = async (tableName: string, userId: string) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping delete");
    return;
  }

  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Error deleting data: ${error.message}`);
    }

    console.log(`Data deleted successfully from ${tableName}`);
  } catch (error: any) {
    console.error("Error deleting data:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};

/**
 * Fetch data from a specific table
 * @param tableName - The name of the table
 * @param userId - The user ID to filter by
 * @returns The fetched data
 */
export const fetchDataFromTable = async (tableName: string, userId: string) => {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

/**
 * Update a specific record
 * @param tableName - The name of the table
 * @param id - The record ID
 * @param data - The data to update
 */
export const updateRecord = async (tableName: string, id: string, data: any) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping update");
    return;
  }

  try {
    const { error } = await supabase
      .from(tableName)
      .update(data)
      .eq("id", id);

    if (error) {
      throw new Error(`Error updating record: ${error.message}`);
    }

    console.log(`Record updated successfully in ${tableName}`);
  } catch (error: any) {
    console.error("Error updating record:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};

/**
 * Check if data exists for a user
 * @param tableName - The name of the table
 * @param userId - The user ID
 * @returns Boolean indicating if data exists
 */
export const hasExistingData = async (tableName: string, userId: string): Promise<boolean> => {
  if (!supabase) {
    return false;
  }

  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select("*", { count: 'exact', head: true })
      .eq("user_id", userId);

    if (error) {
      console.error(`Error checking data in ${tableName}:`, error);
      return false;
    }

    return (count || 0) > 0;
  } catch (error: any) {
    console.error("Error checking existing data:", error.message);
    return false;
  }
};

/**
 * Delete all user data across all tables
 * Useful for "clear all data" functionality
 * @param userId - The user ID
 */
export const deleteAllUserData = async (userId: string) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping delete");
    return;
  }

  const tables = [
    'personal_details',
    'education_details',
    'experience_details',
    'project_details',
    'skills',
    'hobbies',
    'certifications',
    'languages'
  ];

  try {
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("user_id", userId);
      
      if (error) {
        console.warn(`Error deleting from ${table}:`, error);
      }
    }
    console.log(`All data deleted for user: ${userId}`);
  } catch (error: any) {
    console.error("Error deleting user data:", error.message);
  }
};
