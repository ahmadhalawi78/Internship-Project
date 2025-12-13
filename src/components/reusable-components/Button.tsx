import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variants = {
  primary:
    "bg-gradient-to-r from-[#6692C4] to-[#345B5D] text-white hover:from-[#8AB1D6] hover:to-[#4F7F82] active:from-[#5579A7] active:to-[#2A4A4C] transition-all duration-200",
  secondary:
    "bg-black text-white hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-400",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-md font-medium transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
        ${variants[variant]}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
        ${sizes[size]}
      `}
    >
      {children}
    </button>
  );
}
