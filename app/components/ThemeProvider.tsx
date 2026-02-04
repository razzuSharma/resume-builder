"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
export type ColorVariant = "slate" | "teal" | "navy" | "rose" | "forest" | "violet";

interface ThemeContextType {
  theme: Theme;
  colorVariant: ColorVariant;
  toggleTheme: () => void;
  setColorVariant: (variant: ColorVariant) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorVariant, setColorVariant] = useState<ColorVariant>("slate");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedVariant = localStorage.getItem("colorVariant") as ColorVariant;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
    
    if (savedVariant) {
      setColorVariant(savedVariant);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    
    // Apply color variant class to body for resume styling
    document.body.classList.remove(
      "resume-variant-slate",
      "resume-variant-teal", 
      "resume-variant-navy",
      "resume-variant-rose",
      "resume-variant-forest",
      "resume-variant-violet"
    );
    document.body.classList.add(`resume-variant-${colorVariant}`);
    
    // Save to local storage
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorVariant", colorVariant);
  }, [theme, colorVariant, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorVariant,
        toggleTheme,
        setColorVariant,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
