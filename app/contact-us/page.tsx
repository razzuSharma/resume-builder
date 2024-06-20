"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import SuccessMessageToast from "../components/SuccessMessageToast";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const initialValues: FormValues = {
    name: "",
    email: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    message: Yup.string().required("Required"),
  });

  const [isToastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    console.log(values);
    setSubmitting(false);
    setToastMessage("Message sent successfully!");
    setToastVisible(true);
    resetForm();
  };

  return (
    <div className="container mx-auto mt-32 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative mt-5">
        <img
          src="/contact-image.jpg"
          alt="Contact"
          className="w-full h-auto rounded-2xl shadow-lg"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-teal-500 opacity-25 rounded-2xl"></div>
      </div>
      <div className="relative bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-teal-600 text-center">
          Contact Us
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          We'd love to hear from you! Feel free to reach out with any questions,
          suggestions, or just to say hello.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mb-6">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-600 text-sm font-medium mb-2"
                >
                  Your Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-teal-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-600 text-sm font-medium mb-2"
                >
                  Your Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-teal-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-600 text-sm font-medium mb-2"
                >
                  Your Message
                </label>
                <Field
                  as="textarea"
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:border-teal-500"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 focus:outline-none focus:ring focus:border-teal-500"
                disabled={isSubmitting}
              >
                Send Message
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <SuccessMessageToast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default Contact;
