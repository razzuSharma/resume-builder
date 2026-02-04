import { getSupabaseClient } from "./supabaseClient";

const supabaseClient = getSupabaseClient();

/**
 * Fetch data from multiple tables for a specific user
 * @param tables - Array of table names
 * @param user_id - The user ID to filter by
 * @returns Array of table data
 */
const fetchDataFromTables = async (tables: string[], user_id: string) => {
  if (!supabaseClient) {
    console.warn("Supabase not configured, returning empty data");
    return tables.map(table => ({ tableName: table, data: [] }));
  }

  try {
    const fetchPromises = tables.map(table =>
      supabaseClient
        .from(table)
        .select("*")
        .eq("user_id", user_id)
    );
    const results = await Promise.all(fetchPromises);

    const data = results.map((result, index) => {
      if (result.error) {
        console.warn(`Warning fetching data from ${tables[index]}:`, result.error.message);
        return { tableName: tables[index], data: [] };
      }
      return { tableName: tables[index], data: result.data || [] };
    });

    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    // Return empty data for all tables on error
    return tables.map(table => ({ tableName: table, data: [] }));
  }
};

export default fetchDataFromTables;
