"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
export type ColorVariant = "slate" | "teal" | "navy" | "rose" | "forest" | "violet";
export type AppAccentVariant = ColorVariant;

interface ThemeContextType {
  theme: Theme;
  colorVariant: ColorVariant;
  appAccentVariant: AppAccentVariant;
  toggleTheme: () => void;
  setColorVariant: (variant: ColorVariant) => void;
  setAppAccentVariant: (variant: AppAccentVariant) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorVariant, setColorVariant] = useState<ColorVariant>("slate");
  const [appAccentVariant, setAppAccentVariant] = useState<AppAccentVariant>("teal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedVariant = localStorage.getItem("colorVariant") as ColorVariant;
    const savedAppAccent = localStorage.getItem("appAccentVariant") as AppAccentVariant;
    
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

    // App accent has independent storage, fallback to old colorVariant for migration
    if (savedAppAccent) {
      setAppAccentVariant(savedAppAccent);
    } else if (savedVariant) {
      setAppAccentVariant(savedVariant);
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
    
    // Apply app accent class to body for overall UI styling
    document.body.classList.remove(
      "app-accent-slate",
      "app-accent-teal",
      "app-accent-navy",
      "app-accent-rose",
      "app-accent-forest",
      "app-accent-violet"
    );
    document.body.classList.add(`app-accent-${appAccentVariant}`);
    
    // Save to local storage
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorVariant", colorVariant);
    localStorage.setItem("appAccentVariant", appAccentVariant);
  }, [theme, colorVariant, appAccentVariant, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorVariant,
        appAccentVariant,
        toggleTheme,
        setColorVariant,
        setAppAccentVariant,
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
