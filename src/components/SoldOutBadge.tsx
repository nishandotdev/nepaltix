
import React from "react";

interface SoldOutBadgeProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const SoldOutBadge = ({ size = "medium", className = "" }: SoldOutBadgeProps) => {
  const sizeClasses = {
    small: "text-xs px-2 py-0.5",
    medium: "text-sm px-3 py-1",
    large: "text-base px-4 py-1.5"
  };

  return (
    <div 
      className={`bg-red-100 text-red-800 font-medium rounded-md border border-red-200 inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      SOLD OUT
    </div>
  );
};

export default SoldOutBadge;
