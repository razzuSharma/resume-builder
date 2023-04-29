import { configureStore } from "@reduxjs/toolkit";
import createSliceInputForms from "./createSliceInputForms";
import createSliceAddressDetails from "./createSliceAddressDetails";
import createSliceEducationDetails from "./createEducationDetails";
export const store = configureStore({
  reducer: {
    formInputForms: createSliceInputForms,
    formAddressDetails: createSliceAddressDetails,
    formEducationDetails: createSliceEducationDetails,
  },
});
