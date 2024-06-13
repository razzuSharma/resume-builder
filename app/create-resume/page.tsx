"use client";
import React, { useState } from "react";
import UserDetails from "../pages/UserDetails";
import { EducationDetails } from "../pages/EducationDetails";
import { ExperienceDetails } from "../pages/ExperienceDetails";

const ResumePage = () => {
  const [activeTab, setActiveTab] = useState<
    "UserDetails" | "EducationDetails" | "ExperienceDetails"
  >("UserDetails");

  const handleTabClick = (
    tab: "UserDetails" | "EducationDetails" | "ExperienceDetails"
  ) => {
    setActiveTab(tab);
  };

  const handleFormSubmit = () => {
    // Move to the next tab after form submission
    switch (activeTab) {
      case "UserDetails":
        setActiveTab("EducationDetails");
        break;
      case "EducationDetails":
        setActiveTab("ExperienceDetails");
        break;
      // Add more cases if needed
      default:
        break;
    }
  };

  // Common button styles
  const buttonStyles =
    "py-3 px-5 items-center text-center gap-x-3 border-gray-200 whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:opacity-50 disabled:pointer-events-none transition-colors duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-300 rounded-2xl";
  const activeButtonStyles = "text-blue-500";

  // Tab contents
  const tabContent: { [key: string]: JSX.Element } = {
    UserDetails: <UserDetails onNext={handleFormSubmit} />,
    EducationDetails: <EducationDetails onNext={handleFormSubmit} />,
    ExperienceDetails: <ExperienceDetails onNext={handleFormSubmit} />,
  };

  return (
    <div className="container mx-auto mt-20 p-4">
      <div className="flex">
        <div className="w-1/4 flex items-center justify-center">
          <nav className="flex flex-col space-y-2">
            {Object.keys(tabContent).map((tab, index) => (
              <button
                key={index}
                onClick={() =>
                  handleTabClick(
                    tab as
                      | "UserDetails"
                      | "EducationDetails"
                      | "ExperienceDetails"
                  )
                }
                type="button"
                className={`${buttonStyles} ${
                  activeTab === tab ? activeButtonStyles : ""
                } rounded-2xl bg-gray-100 hover:bg-gray-200`}
                aria-selected={activeTab === tab ? "true" : "false"}
              >
                {tab.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </button>
            ))}
          </nav>
        </div>
        <div className="w-3/4 ms-3">
          <div className="transition-opacity duration-300 ease-in-out">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
