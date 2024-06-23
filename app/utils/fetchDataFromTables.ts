import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseClient = createClientComponentClient();

const fetchDataFromTables = async (tables: string[]) => {
  try {
    const fetchPromises = tables.map(table => supabaseClient.from(table).select("*"));
    const results = await Promise.all(fetchPromises);

    const data = results.map((result, index) => {
      if (result.error) {
        throw new Error(`Error fetching data from ${tables[index]}: ${result.error.message}`);
      }
      return { tableName: tables[index], data: result.data };
    });

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default fetchDataFromTables;
