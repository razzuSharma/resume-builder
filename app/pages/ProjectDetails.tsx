// ProjectDetails.tsx
"use client";
import * as React from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import { FiPlus, FiMinus } from "react-icons/fi";
import ButtonStylings from "../components/Button";
import { useState } from "react";
import { saveDataIntoSupabase } from "../utils/supabaseUtils";

interface Project {
  name: string;
  startDate: string;
  endDate: string | null;
  present: boolean;
  link: string;
  skillsLearned: string[];
}

interface ProjectDetailsProps {
  onNext: () => void;
}

interface MyFormValues {
  projects: Project[];
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
  project: Project;
  arrayHelpers: any;
  values: MyFormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}> = ({
  index,
  expandedIndex,
  toggleAccordion,
  project,
  arrayHelpers,
  values,
  setFieldValue,
}) => {
  const isPresent = values.projects[index].present;

  const handlePresentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(`projects.${index}.present`, e.target.checked);
    if (e.target.checked) {
      setFieldValue(`projects.${index}.endDate`, "");
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
          Project {index + 1}
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
        <InputField label="Project Name" name={`projects.${index}.name`} />
        <InputField
          label="Start Date"
          name={`projects.${index}.startDate`}
          type="date"
        />
        <InputField
          label="End Date"
          name={`projects.${index}.endDate`}
          type="date"
          disabled={isPresent}
        />
        <div className="flex items-center mb-4">
          <Field
            type="checkbox"
            name={`projects.${index}.present`}
            id={`projects.${index}.present`}
            className="mr-2"
            onChange={handlePresentChange}
          />
          <label
            className="py-2 text-green-400"
            htmlFor={`projects.${index}.present`}
          >
            Present
          </label>
        </div>
        <InputField label="Project Link" name={`projects.${index}.link`} />
        <FieldArray
          name={`projects.${index}.skillsLearned`}
          render={(arrayHelpersSkills) => (
            <div>
              {project.skillsLearned.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex items-center mb-2">
                  <InputField
                    label={`Skill ${skillIndex + 1}`}
                    name={`projects.${index}.skillsLearned.${skillIndex}`}
                  />
                  <button
                    type="button"
                    onClick={() => arrayHelpersSkills.remove(skillIndex)}
                    className="ml-2 text-red-500"
                  >
                    <FiMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => arrayHelpersSkills.push("")}
                className="flex items-center py-2 px-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 focus:outline-none transition-colors duration-300"
              >
                <FiPlus className="w-5 h-5 mr-2" /> Add Skill
              </button>
            </div>
          )}
        />
        <button
          type="button"
          onClick={() => arrayHelpers.remove(index)}
          className="flex items-center py-2 px-4 mt-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 focus:outline-none transition-colors duration-300"
        >
          <FiMinus className="w-5 h-5 mr-2" /> Remove
        </button>
      </div>
    </div>
  );
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ onNext }) => {
  const initialValues: MyFormValues = {
    projects: [
      {
        name: "",
        startDate: "",
        endDate: "",
        present: false,
        link: "",
        skillsLearned: [""],
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
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-teal-200 w-full max-w-md">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            console.log({ values, actions });
            try {
              await saveDataIntoSupabase('project_details',values.projects); // Save data into Supabase
              alert("Data saved successfully!");
              onNext();
            } catch (error) {
              console.error("Error saving data: ", error);
              alert("Failed to save data");
            }
            actions.setSubmitting(false);
          }}
        >
          {({ handleReset, values, setFieldValue }) => (
            <Form>
              <FieldArray
                name="projects"
                render={(arrayHelpers) => (
                  <div>
                    {values.projects.map((project, index) => (
                      <AccordionSection
                        key={index}
                        index={index}
                        expandedIndex={expandedIndex}
                        toggleAccordion={toggleAccordion}
                        project={project}
                        arrayHelpers={arrayHelpers}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          name: "",
                          startDate: "",
                          endDate: "",
                          present: false,
                          link: "",
                          skillsLearned: [""],
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

export default ProjectDetails;
