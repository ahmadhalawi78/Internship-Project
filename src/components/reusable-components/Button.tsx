import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string; // className is already in ButtonHTMLAttributes but we keep it for clarity
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-400 transition-all duration-200",
  outline:
    "border border-slate-200 bg-transparent text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30 active:bg-blue-50 transition-all duration-200",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        rounded-md font-medium transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
        ${variants[variant]}
        ${props.disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
        ${sizes[size]}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
