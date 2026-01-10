import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;