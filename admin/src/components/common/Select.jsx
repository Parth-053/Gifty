import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error, 
  disabled = false,
  placeholder = "Select an option",
  required = false
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full appearance-none rounded-xl border bg-white py-2.5 px-4 text-sm outline-none transition-all cursor-pointer
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }
            disabled:bg-gray-50 disabled:cursor-not-allowed
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value || option._id} value={option.value || option._id}>
              {option.label || option.name}
            </option>
          ))}
        </select>
        {/* Custom Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Select;