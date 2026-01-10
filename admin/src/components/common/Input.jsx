import React from 'react';

const Input = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  icon: Icon,
  disabled = false,
  required = false
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-lg border bg-white py-2.5 px-4 text-sm outline-none transition-all
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }
            disabled:bg-gray-50 disabled:text-gray-500
          `}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Input;