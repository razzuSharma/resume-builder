"use client";

import React from "react";
import Link from "next/link";
import { FileText, Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Create Resume", href: "/create-resume" },
        { label: "Preview", href: "/resume" },
        { label: "Templates", href: "/create-resume" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/" },
        { label: "Contact", href: "/contact-us" },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Resume Artisan
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 max-w-sm mb-6">
              Create professional, ATS-friendly resumes in minutes. 
              Stand out from the crowd and land your dream job.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Resume Artisan. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{" "}
              <a
                href="https://rajusharmadahal.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 dark:text-teal-400 hover:underline"
              >
                Raju Sharma
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
