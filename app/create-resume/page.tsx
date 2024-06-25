"use client";
import React, { useState, useEffect } from "react";
import EducationDetails from "../pages/EducationDetails";
import ExperienceDetails from "../pages/ExperienceDetails";
import HobbiesDetails from "../pages/HobbiesDetails";
import SkillsDetails from "../pages/SkillsDetails";
import ProjectDetails from "../pages/ProjectDetails";
import PersonalDetails from "../pages/PersonalDetails";

const ResumePage = () => {
  const [activeTab, setActiveTab] = useState<
    | "PersonalDetails"
    | "EducationDetails"
    | "ExperienceDetails"
    | "HobbiesDetails"
    | "SkillsDetails"
    | "ProjectDetails"
  >("PersonalDetails");

  const handleTabClick = (
    tab:
      | "PersonalDetails"
      | "EducationDetails"
      | "ExperienceDetails"
      | "HobbiesDetails"
      | "SkillsDetails"
      | "ProjectDetails"
  ) => {
    setActiveTab(tab);
  };

  const handleFormSubmit = () => {
    switch (activeTab) {
      case "PersonalDetails":
        setActiveTab("EducationDetails");
        break;
      case "EducationDetails":
        setActiveTab("ExperienceDetails");
        break;
      case "ExperienceDetails":
        setActiveTab("HobbiesDetails");
        break;
      case "HobbiesDetails":
        setActiveTab("SkillsDetails");
        break;
      case "SkillsDetails":
        setActiveTab("ProjectDetails");
        break;
      case "ProjectDetails":
        setActiveTab("PersonalDetails");
        break;
      default:
        break;
    }
  };

  // Common button styles
  const buttonStyles =
    "py-3 px-5 items-center text-center gap-x-3 border border-gray-200 text-gray-500  focus:outline-none disabled:opacity-50 disabled:pointer-events-none transition-colors duration-300 ease-in-out rounded-2xl";
  const activeButtonStyles = "bg-teal-200";
  const hoverStyles = "hover:bg-teal-100 hover:border-teal-300";

  // Tab contents
  const tabContent: { [key: string]: JSX.Element } = {
    PersonalDetails: <PersonalDetails onNext={handleFormSubmit} />,
    EducationDetails: <EducationDetails onNext={handleFormSubmit} />,
    ProjectDetails: <ProjectDetails onNext={handleFormSubmit} />,
    ExperienceDetails: <ExperienceDetails onNext={handleFormSubmit} />,
    HobbiesDetails: <HobbiesDetails onNext={handleFormSubmit} />,
    SkillsDetails: <SkillsDetails onNext={handleFormSubmit} />,
  };

  return (
    <div className="container mx-auto bg-gray-100">
      <div className="flex">
        <div className="w-1/4 flex items-center justify-center">
          <nav className="flex flex-col space-y-2">
            {Object.keys(tabContent).map((tab, index) => (
              <button
                key={index}
                onClick={() =>
                  handleTabClick(
                    tab as
                      | "PersonalDetails"
                      | "EducationDetails"
                      | "ExperienceDetails"
                      | "HobbiesDetails"
                      | "SkillsDetails"
                      | "ProjectDetails"
                  )
                }
                type="button"
                className={`${buttonStyles} ${
                  activeTab === tab ? activeButtonStyles : hoverStyles
                }`}
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
