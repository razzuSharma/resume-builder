import React from "react";
import Image from "next/image";
import Link from "next/link";
import DynamicLink from "../components/Button";
import { roboto_mono } from "../fonts";

const HomeComponent = () => {
  const imageLink = "/okay-bg.jpg";

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center items-center md:items-start">
          <h1
            className={`${roboto_mono.className} text-6xl md:text-5xl font-bold mb-4 text-teal-600`}
          >
            Hello there,
          </h1>
          <p className={`${roboto_mono.className} text-lg leading-relaxed mb-4 text-gray-700`}>
            Ready to embark on a journey to create something extraordinary?
          </p>
          <p className={`${roboto_mono.className} text-base leading-relaxed mb-4 text-gray-700`}>
            Welcome to a place where you can craft a compelling resume for your
            professional journey. Construct an impressive story and share your
            experiences with us{" "}
            <span className="mr-4">
              <Link
                href="/contact-us"
                className="text-ellipsis cursor-pointer underline text-red-500 hover:text-green-800"
              >
                here.
              </Link>
            </span>
          </p>
          <DynamicLink variant="teal" href="/create-resume">
            Get Started
          </DynamicLink>
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

export default HomeComponent;
