"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// Define a type for the possible button/link variants
type Variant = "teal" | "purple" | "skyBlueLighter" | "pink" | "orange" | "primary" | "secondary";
type Size = "sm" | "md" | "lg";

// Define props for the button variant
interface ButtonProps {
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

// Define props for the link variant
interface LinkProps {
  variant?: Variant;
  size?: Size;
  href: string;
  children: React.ReactNode;
  className?: string;
}

// Combine the props using a union type
type ButtonStylingsProps = ButtonProps | LinkProps;

const ButtonStylings: React.FC<ButtonStylingsProps> = (props) => {
  const { variant = "teal", size = "md", children, className = "" } = props;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants: Record<Variant, string> = {
    teal: "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25",
    purple: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25",
    skyBlueLighter: "bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/25",
    pink: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25",
    orange: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25",
    primary: "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
  };

  const variantClass = variants[variant] || variants.teal;
  const sizeClass = sizeClasses[size];

  if ('href' in props) {
    return (
      <Link 
        href={props.href} 
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ${sizeClass} ${variantClass} ${className}`}
      >
        {children}
      </Link>
    );
  }

  const { onClick, disabled = false, loading = false, type = "button" } = props as ButtonProps;

  return (
    <button 
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${variantClass} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default ButtonStylings;
