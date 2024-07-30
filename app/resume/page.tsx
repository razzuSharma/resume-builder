"use client";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllData } from "../redux/features/dataSlice";
import ResumeLayout from "../components/ResumeLayout";
// Configure PDF options

const ResumePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const pdfRef = useRef<HTMLDivElement>(null); // Create a ref for the PDF target element

  const {
    personal_details,
    education_details,
    experience_details,
    skills,
    project_details,
    hobbies,
    loading,
    error,
  } = useAppSelector((state) => state.data);

  useEffect(() => {
    const uniqueIdentifier = localStorage.getItem("user_id");
    if (uniqueIdentifier) {
      dispatch(fetchAllData(uniqueIdentifier)).then((data) => {
        console.log("Data returned:", data);
      });
    } else {
      console.error("No unique identifier found in localStorage.");
    }
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-xl text-red-500">Error: {error}</div>
    );
  }

  // Function to get the target element
  const getTargetElement = () => pdfRef.current;

  return (
    <div>
      <div ref={pdfRef}>
        <ResumeLayout
          personal_details={personal_details}
          education_details={education_details}
          experience_details={experience_details}
          skills={skills}
          project_details={project_details}
          hobbies={hobbies}
        />
      </div>
      <button
        onClick={() => {}}
        className="py-2 px-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 focus:outline-none transition-colors duration-300 mt-8 mx-auto block"
      >
        PRINT
      </button>
    </div>
  );
};

export default ResumePage;
