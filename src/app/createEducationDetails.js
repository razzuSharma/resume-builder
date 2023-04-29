import { createSlice } from "@reduxjs/toolkit";

const createSliceEducationDetails = createSlice({
  name: "formEducationDetails",
  initialState: {
    fordData: {},
  },
  reducers: {
    setFormData: (state, action) => {
      state.fordData = action.payload;
    },
  },
});

export const { setFormData } = createSliceEducationDetails.actions;

export default createSliceEducationDetails.reducer;
