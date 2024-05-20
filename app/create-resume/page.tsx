"use client";
import React, { useState } from "react";
import { UserDetails } from "../pages/UserDetails";
import { EducationDetails } from "../pages/EducationDetails";

const ResumePage = () => {
  const [activeTab, setActiveTab] = useState("userDetails");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  
  // Common button styles
  const buttonStyles =
    "hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-1 inline-flex items-center gap-x-2 border-e-2 border-transparent whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active";
  const activeButtonStyles = "text-blue-500 text-2xl";

  return (
    <div className="container mx-auto mt-20 p-4 flex flex-col justify-center align-middle">
      <div className="flex">
        <div className="w-1/4 border-e border-gray-200 flex gap-2 items-center justify-center">
          <nav
            className="flex flex-col space-y-2"
            aria-label="Tabs"
            role="tablist"
            data-hs-tabs-vertical="true"
          >
            {/* Personal Information Tab */}
            <button
              onClick={() => handleTabClick("userDetails")}
              type="button"
              className={`${buttonStyles} ${
                activeTab === "userDetails" ? activeButtonStyles : ""
              }`}
              id="vertical-tab-with-border-item-1"
              data-hs-tab="#vertical-tab-with-border-1"
              aria-controls="vertical-tab-with-border-1"
              role="tab"
              aria-selected={activeTab === "userDetails" ? "true" : "false"}
            >
              Personal Information
            </button>

            {/* Education Details Tab */}
            <button
              onClick={() => handleTabClick("EducationDetails")}
              type="button"
              className={`${buttonStyles} ${
                activeTab === "EducationDetails" ? activeButtonStyles : ""
              }`}
              id="vertical-tab-with-border-item-2"
              data-hs-tab="#vertical-tab-with-border-2"
              aria-controls="vertical-tab-with-border-2"
              role="tab"
              aria-selected={
                activeTab === "EducationDetails" ? "true" : "false"
              }
            >
              Education Details
            </button>
          </nav>
        </div>
        <div className="w-3/4 ms-3">
          <div
            id="vertical-tab-with-border-1"
            role="tabpanel"
            aria-labelledby="vertical-tab-with-border-item-1"
          >
            <div className="mt-4">
              {/* Render UserDetails or EducationDetails based on activeTab */}
              {activeTab === "userDetails" && <UserDetails />}
              {activeTab === "EducationDetails" && <EducationDetails />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
