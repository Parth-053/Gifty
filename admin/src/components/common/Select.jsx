import React from 'react';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error, 
  disabled = false,
  placeholder = "Select an option" 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full appearance-none rounded-lg border bg-white py-2.5 px-4 text-sm outline-none transition-all
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }
            disabled:bg-gray-50 disabled:cursor-not-allowed
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Select;