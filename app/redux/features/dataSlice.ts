'use client'
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import fetchDataFromTables from "../../utils/fetchDataFromTables";

// Define a type for the slice state
interface DataState {
  personal_details: any[];
  education_details: any[];
  experience_details: any[];
  skills: any[];
  project_details: any[];
  hobbies: any[];
  loading: boolean;
  error: string | null;
  [key: string]: any[] | boolean | string | null;
}

const initialState: DataState = {
  personal_details: [],
  education_details: [],
  experience_details: [],
  skills: [],
  project_details: [],
  hobbies: [],
  loading: false,
  error: null,
};

export const fetchAllData = createAsyncThunk(
  "data/fetchAllData",
  async (_, thunkAPI) => {
    const tables = ["personal_details", "education_details", "experience_details", "skills", "project_details", "hobbies"];
    try {
      const data = await fetchDataFromTables(tables);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllData.fulfilled,
        (state, action: PayloadAction<{ tableName: string; data: any[] }[]>) => {
          state.loading = false;
          action.payload.forEach(({ tableName, data }) => {
            state[tableName] = data;
          });
        }
      )
      .addCase(fetchAllData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
