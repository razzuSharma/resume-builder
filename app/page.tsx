import React from "react";
import Image from "next/image";
import Link from "next/link";
import DynamicButton from "./components/Button";

const Home = () => {
  const imageLink = "/okay-bg.jpg";

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center items-center md:items-start">
          <h1 className="text-6xl md:text-5xl font-bold mb-4 text-teal-600">
            Hello,
          </h1>
          <p className="text-2xl mb-4 text-gray-700">
            Ready to create something amazing together?
          </p>
          <p className="text-xl mb-4 text-gray-700">
            Here you can create a general resume for your hike on a professional
            career. Build an awesome resume and also share your experience with
            us{" "}
            <span className="mr-4">
              <Link
                href="/contact-us"
                className="text-ellipsis cursor-pointer underline text-green-500 hover:text-green-800"
              >
                here.
              </Link>
            </span>
          </p>
          <DynamicButton variant="teal" href="/create-resume">
            Create Now
          </DynamicButton>
        </div>

        <div className="text-center md:text-right rounded-full overflow-hidden">
          <div className="mt-5">
            <Image
              src={imageLink}
              alt="image"
              height={800}
              width={800}
              className="rounded-full ml-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
