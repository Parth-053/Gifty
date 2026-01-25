import React, { forwardRef } from 'react';
 
const Input = forwardRef(({ label, error, icon: Icon, type = "text", className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          ref={ref}  
          type={type}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm 
            focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2
            ${Icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;