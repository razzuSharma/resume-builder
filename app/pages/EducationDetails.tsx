// EducationDetails.tsx
import React, { useState } from "react";
import {
  Formik,
  Form,
  FieldArray,
  Field,
} from "formik";
import { FiPlus, FiMinus } from "react-icons/fi";
import ButtonStylings from "../components/Button";
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  present: boolean;
}

interface EducationDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  educations: Education[];
}

const InputField: React.FC<{
  label: string;
  name: string;
  type?: string;
  disabled?: boolean;
}> = ({ label, name, type = "text", disabled = false }) => (
  <div className="relative z-0 w-full mb-6 group">
    <Field
      type={type}
      name={name}
      id={name}
      className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer"
      required
      disabled={disabled}
    />
    <label
      htmlFor={name}
      className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      {label}
    </label>
  </div>
);

const AccordionSection: React.FC<{
  index: number;
  expandedIndex: number | null;
  toggleAccordion: (index: number) => void;
  education: Education;
  values: MyFormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}> = ({
  index,
  expandedIndex,
  toggleAccordion,
  education,
  values,
  setFieldValue,
}) => {
  const isPresent = values.educations[index].present;

  const handlePresentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(`educations.${index}.present`, e.target.checked);
    if (e.target.checked) {
      setFieldValue(`educations.${index}.endDate`, null);
    }
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-teal-500 border border-b-0 border-teal-200 rounded-t-xl dark:border-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-800 gap-3"
        onClick={() => toggleAccordion(index)}
        aria-expanded={expandedIndex === index ? "true" : "false"}
        aria-controls={`accordion-body-${index}`}
      >
        <span className="flex items-center">
          <FiPlus
            className={`w-5 h-5 me-2 ${
              expandedIndex === index ? "hidden" : "block"
            }`}
          />
          <FiMinus
            className={`w-5 h-5 me-2 ${
              expandedIndex === index ? "block" : "hidden"
            }`}
          />
          Education {index + 1}
        </span>
        <svg
          data-accordion-icon
          className={`w-3 h-3 rotate-${
            expandedIndex === index ? "180" : "0"
          } shrink-0`}
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
        id={`accordion-body-${index}`}
        className={`${
          expandedIndex === index ? "block" : "hidden"
        } border border-teal-300 rounded-lg p-4`}
      >
        <InputField
          label="School Name"
          name={`educations.${index}.schoolName`}
        />
        <InputField label="Degree" name={`educations.${index}.degree`} />
        <InputField
          label="Field of Study"
          name={`educations.${index}.fieldOfStudy`}
        />
        <InputField
          label="Start Date"
          name={`educations.${index}.startDate`}
          type="date"
        />
        <InputField
          label="End Date"
          name={`educations.${index}.endDate`}
          type="date"
          disabled={isPresent}
        />
        <div className="flex items-center mb-4">
          <Field
            type="checkbox"
            name={`educations.${index}.present`}
            id={`educations.${index}.present`}
            className="mr-2"
            onChange={handlePresentChange}
          />
          <label
            className="text-green-600"
            htmlFor={`educations.${index}.present`}
          >
            Present
          </label>
        </div>
      </div>
    </div>
  );
};

export const EducationDetails: React.FC<EducationDetailsProps> = ({
  onNext,
}) => {
  const initialValues: MyFormValues = {
    educations: [
      {
        schoolName: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        present: false,
      },
    ],
  };

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse if clicking on the same section
    } else {
      setExpandedIndex(index); // Expand the clicked section
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen overflow-hidden p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl shadow-teal-200 w-full max-w-md">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            const adjustedValues = {
              ...values,
              experiences: values.educations.map((exp) =>
                exp.present ? { ...exp, endDate: null } : exp
              ),
            };

            console.log({ values: adjustedValues, actions });
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
            await saveDataIntoSupabase(
              "education_details",
              adjustedValues.educations
            );

            onNext();
          }}
        >
          {({ handleReset, values, setFieldValue }) => (
            <Form>
              <FieldArray
                name="educations"
                render={(arrayHelpers) => (
                  <div>
                    {values.educations.map(
                      (education: Education, index: number) => (
                        <AccordionSection
                          key={index}
                          index={index}
                          expandedIndex={expandedIndex}
                          toggleAccordion={toggleAccordion}
                          education={education}
                          values={values}
                          setFieldValue={setFieldValue}
                        />
                      )
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          schoolName: "",
                          degree: "",
                          fieldOfStudy: "",
                          startDate: "",
                          endDate: "",
                          present: false,
                        })
                      }
                      className="flex items-center py-2 px-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 focus:outline-none transition-colors duration-300"
                    >
                      <FiPlus className="w-5 h-5 mr-2" /> Add More
                    </button>
                  </div>
                )}
              />
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

export default EducationDetails;
