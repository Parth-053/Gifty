import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, outline, danger
  size = 'md', // sm, md, lg
  fullWidth = false, 
  isLoading = false, 
  disabled = false, 
  icon: Icon,
  type = 'button',
  onClick,
  className = '' 
}) => {
  
  // Base Styles (Mobile Optimized Touch Targets)
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  // Variants
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-200",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 shadow-lg shadow-gray-200",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 bg-transparent",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };

  // Sizes (Larger on mobile for touch)
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-3 text-sm", // Standard
    lg: "px-6 py-4 text-base", // Hero buttons
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled} 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : 'w-full sm:w-auto'} 
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin mr-2" />
      ) : Icon ? (
        <Icon size={18} className="mr-2" />
      ) : null}
      
      {children}
    </button>
  );
};

export default Button;