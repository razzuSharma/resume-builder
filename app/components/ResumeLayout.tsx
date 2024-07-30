"use client";
import React from "react";

interface ResumeLayoutProps {
  personal_details: any[];
  education_details: any[];
  experience_details: any[];
  skills: any[];
  project_details: any[];
  hobbies: any[];
}

const ResumeLayout: React.FC<ResumeLayoutProps> = ({
  personal_details,
  education_details,
  experience_details,
  skills,
  project_details,
  hobbies,
}) => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Resume</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
        {personal_details.length > 0 ? (
          personal_details.map((data, index) => (
            <div key={index} className="mb-4">
              <p>
                <strong>Name:</strong> {data.firstName} {data.lastName}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Phone:</strong> {data.phone}
              </p>
            </div>
          ))
        ) : (
          <p>No personal details found.</p>
        )}
      </section>

      <hr className="border-t-2 border-gray-300 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        {education_details.length > 0 ? (
          education_details.map((data, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{data.degree}</h3>
              <p>
                {data.fieldOfStudy}, {data.startDate} -{" "}
                {data.present ? "Present" : data.endDate}
              </p>
            </div>
          ))
        ) : (
          <p>No education details found.</p>
        )}
      </section>

      <hr className="border-t-2 border-gray-300 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        {experience_details.length > 0 ? (
          experience_details.map((data, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{data.position}</h3>
              <p>
                {data.companyName}, {data.startDate} - {data.endDate}
              </p>
              {Array.isArray(data.responsibilities) &&
              data.responsibilities.length > 0 ? (
                <ul className="list-disc ml-5">
                  {data.responsibilities.map(
                    (
                      resp:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | React.PromiseLikeOfReactNode
                        | null
                        | undefined,
                      i: React.Key | null | undefined
                    ) => (
                      <li key={i}>{resp}</li>
                    )
                  )}
                </ul>
              ) : (
                <p>No responsibilities listed.</p>
              )}
            </div>
          ))
        ) : (
          <p>No experience details found.</p>
        )}
      </section>

      <hr className="border-t-2 border-gray-300 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <ul className="list-disc ml-5">
          {skills.length > 0 ? (
            skills.map((skill, index) => {
              const skillsArray = JSON.parse(skill.skills);
              return skillsArray.map(
                (
                  sk:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined,
                  i: any
                ) => <li key={`${index}-${i}`}>{sk}</li>
              );
            })
          ) : (
            <p>No skills found.</p>
          )}
        </ul>
      </section>

      <hr className="border-t-2 border-gray-300 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        {project_details.length > 0 ? (
          project_details.map((data, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{data.projectName}</h3>
              <p>
                {data.startDate} - {data.endDate}
              </p>
              <p>
                Link:{" "}
                <a
                  href={data.projectLink}
                  className="text-teal-500 hover:underline"
                >
                  Project Link
                </a>
              </p>
              <p>Skills Learned: {data.skillsLearned}</p>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </section>

      <hr className="border-t-2 border-gray-300 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hobbies</h2>
        <ul className="list-disc ml-5">
          {hobbies.length > 0 ? (
            hobbies.map((hobby, index) => {
              const hobbiesArray = JSON.parse(hobby.hobbies);
              return hobbiesArray.map(
                (
                  hobbyItem:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined,
                  i: any
                ) => <li key={`${index}-${i}`}>{hobbyItem}</li>
              );
            })
          ) : (
            <p>No hobbies found.</p>
          )}
        </ul>
      </section>
    </div>
  );
};

export default ResumeLayout;
