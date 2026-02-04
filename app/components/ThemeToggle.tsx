"use client";

import React from "react";
import { Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const colorVariants = [
  { id: "slate", name: "Slate", color: "bg-slate-600" },
  { id: "teal", name: "Teal", color: "bg-teal-600" },
  { id: "navy", name: "Navy", color: "bg-blue-700" },
  { id: "rose", name: "Rose", color: "bg-rose-600" },
  { id: "forest", name: "Forest", color: "bg-green-700" },
  { id: "violet", name: "Violet", color: "bg-violet-600" },
] as const;

export function ThemeToggle() {
  const { theme, colorVariant, toggleTheme, setColorVariant, isDark } = useTheme();
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Color Variant Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Change color theme"
        >
          <Palette className="w-5 h-5" />
        </button>

        {showColorPicker && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowColorPicker(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                Resume Theme
              </p>
              <div className="grid grid-cols-3 gap-2">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setColorVariant(variant.id as any);
                      setShowColorPicker(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                      colorVariant === variant.id
                        ? "bg-gray-100 dark:bg-gray-700 ring-2 ring-teal-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${variant.color} ${
                        colorVariant === variant.id
                          ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800"
                          : ""
                      }`}
                    />
                    <span className="text-[10px] text-gray-600 dark:text-gray-300">
                      {variant.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dark/Light Toggle */}
      <button
        onClick={toggleTheme}
        className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <div className="relative w-5 h-5">
          <Sun
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
              isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <Moon
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
              isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
