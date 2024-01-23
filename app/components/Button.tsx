import React from "react";
import Link from "next/link";
// Define a type for the possible link variants
type LinkVariant = "teal" | "purple";

const DynamicLink: React.FC<{
  variant: LinkVariant;
  href: string;
  children: React.ReactNode;
}> = ({ variant, href, children }) => {
  const linkVariants: Record<LinkVariant, string> = {
    teal: "bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300",
    purple:
      "bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300",
  };
  const variantClass = linkVariants[variant] || linkVariants.teal;
  return (
    <Link
      href={href}
      className={`focus:outline-none text-white font-medium rounded-lg text-sm px-6 py-3 ${variantClass}`}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;
