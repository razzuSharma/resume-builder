import React from "react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ResumePage: React.FC = async () => {
  const supabaseGetData = createClientComponentClient();
  try {
    const { data: displayedData, error } = await supabaseGetData
      .from("personal_details")
      .select("*");
    if (error) {
      throw new Error(`Error inserting data: ${error.message}`);
    }
    console.log("Data displayed successfully:", displayedData);
  } catch (error: any) {
    console.error("Error inserting data:", error.message);
    throw error;
  }
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Resume</h1>

      {/* Personal Details Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-ce">
          Personal Details
        </h2>
        <p>
          <strong>Name:</strong> John Doe
        </p>
        <p>
          <strong>Email:</strong> john.doe@example.com
        </p>
        <p>
          <strong>Phone:</strong> (123) 456-7890
        </p>
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />

      {/* Education Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">
            Bachelor of Science in Computer Science
          </h3>
          <p>XYZ University, 2015 - 2019</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">High School Diploma</h3>
          <p>ABC High School, 2011 - 2015</p>
        </div>
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />

      {/* Experience Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Software Developer</h3>
          <p>Tech Company Inc., 2020 - Present</p>
          <ul className="list-disc ml-5">
            <li>
              Developed and maintained web applications using React and Node.js.
            </li>
            <li>
              Collaborated with cross-functional teams to define project
              requirements and deliver solutions.
            </li>
            <li>Optimized applications for maximum speed and scalability.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Junior Developer</h3>
          <p>Another Tech Company, 2019 - 2020</p>
          <ul className="list-disc ml-5">
            <li>
              Assisted in the development of internal tools and client projects.
            </li>
            <li>
              Conducted code reviews and provided feedback to team members.
            </li>
            <li>
              Participated in Agile ceremonies and contributed to sprint
              planning.
            </li>
          </ul>
        </div>
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />

      {/* Skills Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <ul className="list-disc ml-5">
          <li>JavaScript (ES6+)</li>
          <li>React</li>
          <li>Node.js</li>
          <li>HTML & CSS</li>
          <li>Git & GitHub</li>
          <li>Agile Methodologies</li>
        </ul>
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />

      {/* Projects Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Project Name</h3>
          <p>Start Date - End Date</p>
          <p>
            Link:{" "}
            <a href="#" className="text-teal-500 hover:underline">
              Project Link
            </a>
          </p>
          <p>Skills Learned: React, Node.js, MongoDB</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Another Project Name</h3>
          <p>Start Date - End Date</p>
          <p>
            Link:{" "}
            <a href="#" className="text-teal-500 hover:underline">
              Project Link
            </a>
          </p>
          <p>Skills Learned: Vue, Firebase</p>
        </div>
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />

      {/* Hobbies Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hobbies</h2>
        <ul className="list-disc ml-5">
          <li>Reading</li>
          <li>Traveling</li>
          <li>Coding</li>
          <li>Photography</li>
        </ul>
      </section>
    </div>
  );
};

export default ResumePage;
