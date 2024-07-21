import React from "react";
const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025{" "}
          <a href="#" className="hover:underline">
            Resume Artisan
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <span> Made with 💗 by </span>
            <a
              href="https://rajusarma.com.np/"
              className="hover:underline me-4 md:me-6"
            >
              Raju_Sharma and the team.
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
