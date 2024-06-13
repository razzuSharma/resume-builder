// EducationDetails.tsx
"use client";
import React from "react";
import { Formik, Form, Field } from "formik";

interface MyFormValues {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

interface EducationDetailsProps {
  onNext: () => void;
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
      className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      required
    />
    <label
      htmlFor={name}
      className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      {label}
    </label>
  </div>
);

export const EducationDetails: React.FC<EducationDetailsProps> = ({ onNext }) => {
  const initialValues: MyFormValues = {
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    graduationYear: "",
  };

  return (
    <div className="flex justify-center items-center min-h-screen overflow-hidden p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl shadow-teal-200 w-full max-w-md">
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            console.log({ values, actions });
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
            onNext();
          }}
        >
          {({ handleReset }) => (
            <Form>
              <InputField label="School Name" name="schoolName" />
              <InputField label="Degree" name="degree" />
              <InputField label="Field of Study" name="fieldOfStudy" />
              <InputField label="Graduation Year" name="graduationYear" />
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                  }}
                  className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Next
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EducationDetails;
