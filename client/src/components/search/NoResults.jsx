import React from 'react';
import { SearchX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoResults = ({ query, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm mx-4 sm:mx-0">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <SearchX size={40} />
      </div>
      
      <h3 className="text-xl font-black text-gray-900 mb-2">
        No matches for "{query}"
      </h3>
      
      <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
        We couldn't find any products matching your search. Try checking for typos or use broader keywords.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onReset}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          Clear Filters
        </button>
        <Link 
          to="/categories"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          Browse Categories <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NoResults;