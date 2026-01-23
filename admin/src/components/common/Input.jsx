import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200
          ${error 
            ? "border-red-500 focus:ring-red-200" 
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
          }
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;