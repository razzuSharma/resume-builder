// UserDetails.tsx
"use client"
import * as React from "react";
import { Formik, Form, Field } from "formik";

interface UserDetailsProps {
  onNext: () => void; // Define onNext prop in interface
}

interface MyFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Reusable InputField component
const InputField: React.FC<{
  label: string;
  name: string;
  type?: string;
}> = ({ label, name, type = "text" }) => (
  <div className="relative z-0 w-full mb-5 group">
    <Field
      type={type}
      name={name}
      id={name}
      className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      required
    />
    <label
      htmlFor={name}
      className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
    <div className="mt-1">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
          onNext(); // Call onNext function after form submission
        }}
      >
        {({ handleReset }) => (
          <Form className="max-w-md mx-auto">
            <InputField label="First Name" name="firstName" />
            <InputField label="Last Name" name="lastName" />
            <InputField label="Email Address" name="email" type="email" />
            <InputField label="Phone Number" name="phone" type="tel" />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  handleReset();
                }}
                className="text-white mr-3 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-dark-300 font-medium rounded-2xl text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Clear
              </button>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Next
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserDetails;
