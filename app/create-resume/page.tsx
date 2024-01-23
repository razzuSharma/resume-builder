import React from "react";

const ResumePage = () => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-4">My Resume</h1>
      
      {/* Add your resume content here */}
      <div>
        <p className="text-lg mb-2">Summary of qualifications:</p>
        <ul className="list-disc pl-4">
          <li>Experience 1</li>
          <li>Experience 2</li>
          {/* Add more experience items */}
        </ul>

        <p className="text-lg mt-4 mb-2">Education:</p>
        <ul className="list-disc pl-4">
          <li>Degree 1</li>
          <li>Degree 2</li>
          {/* Add more education items */}
        </ul>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default ResumePage;
