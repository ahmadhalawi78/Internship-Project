"user client";
import { ReactNode, ChangeEventHandler } from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  icon?: ReactNode | null;
  onIconClick?: () => void;
  onChange?: (value: string) => void;
  value?: string;
}

export default function Input({
  type = "text",
  placeholder = "",
  icon = null,
  onChange,
  value,
  onIconClick,
}: InputProps) {
  return (
    <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg overflow-hidden bg-white">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 outline-none text-gray-700"
      />

      {icon && (
        <button
          type="button"
          onClick={onIconClick}
          className="px-4 py-2 bg-black text-white flex items-center justify-center hover:bg-gray-800 active:scale-95"
        >
          {icon}
        </button>
      )}
    </div>
  );
}
