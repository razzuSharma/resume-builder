import React from "react";
import Link from "next/link";

// Define a type for the possible button/link variants
type Variant = "teal" | "purple" | "skyBlueLighter" | "pink" | "orange";

// Define props for the button variant
interface ButtonProps {
  variant: Variant;
  onClick: () => void;
  children: React.ReactNode;
}

// Define props for the link variant
interface LinkProps {
  variant: Variant;
  href: string;
  children: React.ReactNode;
}

// Combine the props using a union type
type ButtonStylingsProps = ButtonProps | LinkProps;

const ButtonStylings: React.FC<ButtonStylingsProps> = (props) => {
  const { variant, children } = props;

  const variants: Record<Variant, string> = {
    teal: "bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 rounded-xl",
    purple: "bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 rounded-xl",
    skyBlueLighter: "bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 rounded-xl",
    pink: "bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 rounded-xl",
    orange: "bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 rounded-xl",
  };

  const variantClass = variants[variant] || variants.teal;

  if ('href' in props) {
    return (
      <Link href={props.href} className={`focus:outline-none text-white font-medium text-sm px-6 py-3 ${variantClass}`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={`focus:outline-none text-white font-medium text-sm px-6 py-3 ${variantClass}`}>
      {children}
    </button>
  );
};

export default ButtonStylings;
