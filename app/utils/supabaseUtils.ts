import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();
export const saveDataIntoSupabase = async (tableName: string, data: any) => {
  try {
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data);

    if (error) {
      throw new Error(`Error inserting data: ${error.message}`);
    }

    console.log("Data inserted successfully:", insertedData);
    return data.ID; // Optional: Return the inserted data or ID
  } catch (error:any) {
    console.error("Error inserting data:", error.message);
    throw error;
  }
};
