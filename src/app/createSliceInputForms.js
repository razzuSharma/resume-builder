import { createSlice } from '@reduxjs/toolkit';

const createSliceInputForms = createSlice({
  name: 'formInputForms',
  initialState: {
    formData: {}, // Fix typo here
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
});

export const { setFormData } = createSliceInputForms.actions;

export default createSliceInputForms.reducer;
