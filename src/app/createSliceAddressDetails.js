import { createSlice } from "@reduxjs/toolkit";

const createSliceAddressDetailsForms = createSlice({
  name: "formAddressDetails",
  initialState: {
    fordData: {},
  },
  reducers: {
    setFormData: (state, action) => {
      state.fordData = action.payload;
    },
  },
});

export const { setFormData } = createSliceAddressDetailsForms.actions;

export default createSliceAddressDetailsForms.reducer;
