// UserDetails.tsx
"use client";
import * as React from "react";
import { Formik, Form, Field } from "formik";
import ButtonStylings from "../components/Button";

import { saveDataIntoSupabase } from "../utils/supabaseUtils";
interface UserDetailsProps {
  onNext: () => void;
}
export interface MyFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const InputField: React.FC<{
  label: string;
  name: string;
  type?: string;
}> = ({ label, name, type = "text" }) => (
  <div className="relative z-0 w-full mb-6 group">
    <Field
      type={type}
      name={name}
      id={name}
      className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer"
      required
    />
    <label
      htmlFor={name}
      className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      {label}
    </label>
  </div>
);

const UserDetails: React.FC<UserDetailsProps> = ({ onNext }) => {
  const initialValues: MyFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  return (
    <div className="flex justify-center items-center min-h-screen overflow-hidden p-4">
      <div className="bg-white md:p-8 rounded-2xl shadow-xl shadow-teal-200 w-full max-w-md">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
            await saveDataIntoSupabase("personal_details", values);
            onNext();
          }}
        >
          {({ handleReset }) => (
            <Form>
              <InputField label="First Name" name="firstName" />
              <InputField label="Last Name" name="lastName" />
              <InputField label="Email Address" name="email" type="email" />
              <InputField label="Phone Number" name="phone" />
              <div className="flex justify-end mt-6 gap-3">
                <ButtonStylings
                  variant="teal"
                  onClick={() => {
                    handleReset();
                  }}
                >
                  Clear
                </ButtonStylings>
                <ButtonStylings variant="purple" onClick={() => {}}>
                  Next
                </ButtonStylings>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserDetails;
