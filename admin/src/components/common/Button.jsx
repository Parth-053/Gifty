import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  size = "md", 
  isLoading = false, 
  disabled = false, 
  className = "",
  icon: Icon
}) => {
  
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;