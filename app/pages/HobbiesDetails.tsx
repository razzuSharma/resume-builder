// HobbiesDetails.tsx
"use client";
import * as React from "react";
import { useState } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import { FiPlus, FiMinus } from "react-icons/fi";
import ButtonStylings from "../components/Button";
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

interface HobbiesDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  hobbies: string[];
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

const HobbiesDetails: React.FC<HobbiesDetailsProps> = ({ onNext }) => {
  const initialValues: MyFormValues = {
    hobbies: [""],
  };

  return (
    <div className="flex justify-center items-center min-h-screen overflow-hidden p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-teal-200 w-full max-w-md">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            console.log({ values, actions });
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
            await saveDataIntoSupabase("hobbies", values);
            onNext();
          }}
        >
          {({ handleReset, values }) => (
            <Form>
              <div className="mb-4">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-teal-500 border border-b-0 border-teal-200 rounded-t-xl dark:border-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-800 gap-3"
                  aria-expanded="true"
                  aria-controls="accordion-body-0"
                >
                  <span className="flex items-center">
                    <FiMinus className="w-5 h-5 me-2 block" />
                    Hobbies
                  </span>
                  <svg
                    data-accordion-icon
                    className="w-3 h-3 rotate-180 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
                <div
                  id="accordion-body-0"
                  className="border border-teal-300 rounded-lg p-4"
                >
                  <FieldArray
                    name="hobbies"
                    render={(arrayHelpers) => (
                      <div>
                        {values.hobbies.map((hobby, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <InputField
                              label={`Hobby ${index + 1}`}
                              name={`hobbies.${index}`}
                            />
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              className="ml-2 text-red-500"
                            >
                              <FiMinus />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => arrayHelpers.push("")}
                          className="flex items-center py-2 px-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 focus:outline-none transition-colors duration-300"
                        >
                          <FiPlus className="w-5 h-5 mr-2" /> Add Hobby
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
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

export default HobbiesDetails;
