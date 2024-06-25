"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllData } from "../redux/features/dataSlice";

const ResumePage: React.FC = () => {
  const dispatch = useAppDispatch();
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
    dispatch(fetchAllData()).then((data) => {
      console.log("Data returned:", data);
    });
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Resume</h1>
      {/* Personal Details Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
        {personal_details.length > 0 ? (
          personal_details.map((data: any, index: number) => (
            <div key={index}>
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
          <div></div>
        )}
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        {education_details.length > 0 ? (
          education_details.map((data: any, index: number) => (
            <div key={index}>
              <h3 className="text-xl font-semibold">{data.degree}</h3>
              <p>
                {data.fieldOfStudy}, {data.startDate} -{" "}
                {data.present ? "Present" : data.endDate}
              </p>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </section>

      <hr className="border-t-2 border-gray-300 my-8" />
      {/* Experience Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        {experience_details.length > 0 ? (
          experience_details.map((data: any, index: number) => (
            <div key={index}>
              <h3 className="text-xl font-semibold">{data.position}</h3>
              <p>
                {data.companyName}, {data.startDate} - {data.endDate}
              </p>
              {data.length > 0 ? (
                <ul className="list-disc ml-5">
                  {data.responsibilities.map((resp: any, i: number) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              ) : (
                <></>
              )}
            </div>
          ))
        ) : (
          <div></div>
        )}
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />
      {/* Skills Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <ul className="list-disc ml-5">
          {skills.length > 0 ? (
            skills.map((skill: any, index: number) => {
              const skillsArray = JSON.parse(skill.skills);
              return skillsArray.map((sk: string, i: number) => (
                <li key={`${index}-${i}`}>{sk}</li>
              ));
            })
          ) : (
            <div></div>
          )}
        </ul>
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />
      {/* Projects Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        {project_details.length > 0 ? (
          project_details.map((data: any, index: number) => (
            <div key={index}>
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
          <div></div>
        )}
      </section>
      <hr className="border-t-2 border-gray-300 my-8" />
      {/* Hobbies Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hobbies</h2>
        <ul className="list-disc ml-5">
          {hobbies.length > 0 ? (
            hobbies.map((hobby: any, index: number) => {
              const hobbiesArray = JSON.parse(hobby.hobbies);
              return hobbiesArray.map((hobbyItem: string, i: number) => (
                <li key={`${index}-${i}`}>{hobbyItem}</li>
              ));
            })
          ) : (
            <div>No hobbies found.</div>
          )}
        </ul>
      </section>
    </div>
  );
};

export default ResumePage;
