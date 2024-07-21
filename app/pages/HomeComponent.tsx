import React from "react";
import Image from "next/image";
import Link from "next/link";
import DynamicLink from "../components/Button";
import { roboto_mono } from "../fonts";

const HomeComponent = () => {
  const imageLink = "/background.png";
  const downArrow = "/down-arrow.png";

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-32">
        <div className="flex flex-col justify-center items-center md:items-start relative">
          <h1
            className={`${roboto_mono.className} text-6xl md:text-5xl font-bold mb-4 text-teal-600`}
          >
            Hello there,
          </h1>
          <p
            className={`${roboto_mono.className} text-lg leading-relaxed mb-4 text-gray-700`}
          >
            Ready to embark on a journey to create something extraordinary?
          </p>
          <p
            className={`${roboto_mono.className} text-base leading-relaxed mb-4 text-gray-700`}
          >
            Welcome to a place where you can craft a compelling resume for your
            professional journey. Construct an impressive story and share your
            experiences with us{" "}
            <span className="mr-4">
              <Link
                href="/contact-us"
                className="text-ellipsis cursor-pointer text-red-500 hover:text-green-800 hover:underline"
              >
                here.
              </Link>
            </span>
          </p>
          <div className="relative mt-10">
            <DynamicLink variant="teal" href="/create-resume">
              Get Started
            </DynamicLink>
            <div className="absolute -top-11 right-20">
              <Image src={downArrow} alt="Down Arrow" height={50} width={50} />
            </div>
          </div>
        </div>

        <div className="flex flex-col min-h-full">
          <div className="mt-10 ">
            <Image
              src={imageLink}
              alt="image"
              height={500}
              width={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;
