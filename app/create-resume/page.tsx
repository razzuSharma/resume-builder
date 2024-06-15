"use client";
import React, { useState } from "react";
import UserDetails from "../pages/UserDetails";
import { EducationDetails } from "../pages/EducationDetails";
import { ExperienceDetails } from "../pages/ExperienceDetails";
import HobbiesDetails from "../pages/HobbiesDetails";
import SkillsDetails from "../pages/SkillsDetails";
import ProjectDetails from "../pages/ProjectDetails";

const ResumePage = () => {
  const [activeTab, setActiveTab] = useState<
    "UserDetails" | "EducationDetails" | "ExperienceDetails" | "HobbiesDetails" | "SkillsDetails" | "ProjectDetails"
  >("UserDetails");

  const handleTabClick = (
    tab: "UserDetails" | "EducationDetails" | "ExperienceDetails" | "HobbiesDetails" | "SkillsDetails" | "ProjectDetails"
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
      case "HobbiesDetails":
        setActiveTab("HobbiesDetails");
        break;
      case "SkillsDetails":
        setActiveTab("SkillsDetails");
        break;
      case "ProjectDetails":
        setActiveTab("ProjectDetails");
        break;
      // Add more cases if needed
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
    UserDetails: <UserDetails onNext={handleFormSubmit} />,
    EducationDetails: <EducationDetails onNext={handleFormSubmit} />,
    ExperienceDetails: <ExperienceDetails onNext={handleFormSubmit} />,
    HobbiesDetails: <HobbiesDetails  onNext={handleFormSubmit}/>,
    SkillsDetails: <SkillsDetails  onNext={handleFormSubmit}/>,
    ProjectDetails: <ProjectDetails  onNext={handleFormSubmit}/>,
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
                      | "UserDetails"
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
