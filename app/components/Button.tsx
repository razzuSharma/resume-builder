import React from "react";
import Link from "next/link";
// Define a type for the possible link variants
type LinkVariant = "teal" | "purple" | "skyBlueLighter" | "pink" | "orange";

const DynamicLink: React.FC<{
  variant: LinkVariant;
  href: string;
  children: React.ReactNode;
}> = ({ variant, href, children }) => {
  const linkVariants: Record<LinkVariant, string> = {
    teal: "bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 rounded-xl",
    purple:
      "bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 rounded-xl",
    skyBlueLighter:
      "bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 rounded-xl",
    pink: "bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 rounded-xl",
    orange:
      "bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 rounded-xl",
  };

  const variantClass = linkVariants[variant] || linkVariants.teal;
  return (
    <Link
      href={href}
      className={`focus:outline-none text-white font-medium text-sm px-6 py-3 ${variantClass}`}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;
