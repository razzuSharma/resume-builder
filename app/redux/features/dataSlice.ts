'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import fetchDataFromTables from "../../utils/fetchDataFromTables";
import type { ResumeData } from "../../types";

// Define a type for the slice state
interface DataState extends ResumeData {
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  personal_details: [],
  education_details: [],
  experience_details: [],
  skills: [],
  project_details: [],
  hobbies: [],
  certifications: [],
  languages: [],
  loading: false,
  error: null,
};

export const fetchAllData = createAsyncThunk(
  "data/fetchAllData",
  async (user_id: string, thunkAPI) => {
    const tables = [
      "personal_details",
      "education_details",
      "experience_details",
      "skills",
      "project_details",
      "hobbies",
      "certifications",
      "languages"
    ];
    try {
      const data = await fetchDataFromTables(tables, user_id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    clearData: (state) => {
      state.personal_details = [];
      state.education_details = [];
      state.experience_details = [];
      state.skills = [];
      state.project_details = [];
      state.hobbies = [];
      state.certifications = [];
      state.languages = [];
      state.error = null;
    },
    updatePersonalDetails: (state, action: PayloadAction<any>) => {
      state.personal_details = [action.payload];
    },
    updateEducation: (state, action: PayloadAction<any[]>) => {
      state.education_details = action.payload;
    },
    updateExperience: (state, action: PayloadAction<any[]>) => {
      state.experience_details = action.payload;
    },
    updateProjects: (state, action: PayloadAction<any[]>) => {
      state.project_details = action.payload;
    },
    updateSkills: (state, action: PayloadAction<any[]>) => {
      state.skills = action.payload;
    },
    updateHobbies: (state, action: PayloadAction<any[]>) => {
      state.hobbies = action.payload;
    },
  },
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
            switch (tableName) {
              case "personal_details":
                state.personal_details = data || [];
                break;
              case "education_details":
                state.education_details = data || [];
                break;
              case "experience_details":
                state.experience_details = data || [];
                break;
              case "skills":
                state.skills = data || [];
                break;
              case "project_details":
                state.project_details = data || [];
                break;
              case "hobbies":
                state.hobbies = data || [];
                break;
              case "certifications":
                state.certifications = data || [];
                break;
              case "languages":
                state.languages = data || [];
                break;
            }
          });
        }
      )
      .addCase(fetchAllData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export const { 
  clearData, 
  updatePersonalDetails,
  updateEducation,
  updateExperience,
  updateProjects,
  updateSkills,
  updateHobbies
} = dataSlice.actions;
export default dataSlice.reducer;
