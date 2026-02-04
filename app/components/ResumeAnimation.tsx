"use client";

import React from "react";
import { motion } from "framer-motion";

const ResumeAnimation = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full max-w-[400px] max-h-[500px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background glow */}
        <motion.circle
          cx="200"
          cy="250"
          r="180"
          fill="currentColor"
          className="text-teal-500/10 dark:text-teal-400/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Resume Paper */}
        <motion.g
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <rect
            x="50"
            y="30"
            width="300"
            height="420"
            rx="8"
            className="fill-white dark:fill-gray-800"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Header bar */}
          <rect
            x="50"
            y="30"
            width="300"
            height="80"
            rx="8"
            className="fill-teal-600 dark:fill-teal-500"
          />
          <rect
            x="50"
            y="70"
            width="300"
            height="40"
            className="fill-teal-600 dark:fill-teal-500"
          />

          {/* Name lines */}
          <motion.rect
            x="80"
            y="50"
            width="150"
            height="12"
            rx="6"
            className="fill-white/90"
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          />
          <motion.rect
            x="80"
            y="70"
            width="100"
            height="8"
            rx="4"
            className="fill-white/70"
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ duration: 0.5, delay: 1 }}
          />

          {/* Content sections */}
          {/* Left column */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {/* Section headers */}
            <rect x="70" y="130" width="80" height="6" rx="3" className="fill-teal-500 dark:fill-teal-400" />
            <rect x="220" y="130" width="100" height="6" rx="3" className="fill-teal-500 dark:fill-teal-400" />

            {/* Left content lines */}
            <rect x="70" y="150" width="100" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="70" y="160" width="80" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="70" y="170" width="90" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />

            <rect x="70" y="200" width="100" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="70" y="210" width="80" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="70" y="220" width="90" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />

            {/* Right content lines */}
            <rect x="220" y="150" width="110" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="220" y="160" width="110" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="220" y="170" width="90" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="220" y="180" width="100" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />

            <rect x="220" y="210" width="110" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="220" y="220" width="110" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
            <rect x="220" y="230" width="90" height="4" rx="2" className="fill-gray-300 dark:fill-gray-600" />
          </motion.g>

          {/* Animated checkmarks */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.5 }}
          >
            <circle cx="340" cy="150" r="10" className="fill-green-500" />
            <path
              d="M336 150 L339 153 L344 147"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </motion.g>

          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.7 }}
          >
            <circle cx="340" cy="210" r="10" className="fill-green-500" />
            <path
              d="M336 210 L339 213 L344 207"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </motion.g>

          {/* Floating elements */}
          <motion.circle
            cx="30"
            cy="100"
            r="15"
            className="fill-purple-500/30 dark:fill-purple-400/30"
            animate={{ y: [-10, 10, -10], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="370"
            cy="350"
            r="20"
            className="fill-amber-500/30 dark:fill-amber-400/30"
            animate={{ y: [10, -10, 10], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="40"
            cy="380"
            r="12"
            className="fill-pink-500/30 dark:fill-pink-400/30"
            animate={{ y: [-5, 15, -5], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Pen icon */}
        <motion.g
          initial={{ x: -20, y: 20, opacity: 0, rotate: -15 }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <rect
            x="280"
            y="380"
            width="60"
            height="12"
            rx="6"
            transform="rotate(-45 310 386)"
            className="fill-teal-600 dark:fill-teal-400"
          />
          <polygon
            points="325,335 335,345 325,355"
            transform="translate(0, 0)"
            className="fill-gray-700 dark:fill-gray-300"
          />
        </motion.g>
      </svg>
    </div>
  );
};

export default ResumeAnimation;
