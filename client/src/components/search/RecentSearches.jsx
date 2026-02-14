import React from 'react';
import { Clock, TrendingUp, X, Search } from 'lucide-react';

const RecentSearches = ({ recent = [], trending = [], onSelect, onClear }) => {
  return (
    <div className="bg-white">
      
      {/* --- Recent Searches Section --- */}
      {recent.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Searches</h3>
            <button onClick={onClear} className="text-xs font-bold text-purple-600 hover:text-purple-700">
              CLEAR
            </button>
          </div>
          <div>
            {recent.map((term, index) => (
              <div 
                key={index}
                onClick={() => onSelect(term)}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 active:bg-gray-50 cursor-pointer"
              >
                <Clock size={16} className="text-gray-400 shrink-0" />
                <span className="text-gray-700 text-sm font-medium truncate flex-1">{term}</span>
                <span className="text-gray-300 -rotate-45">
                  <ArrowUp size={16} /> 
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Trending Searches Section --- */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-purple-100 p-1.5 rounded-full">
            <TrendingUp size={16} className="text-purple-700" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Trending Search</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {trending.map((term, index) => (
            <button
              key={index}
              onClick={() => onSelect(term)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 font-medium hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all active:scale-95"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Icon for the list
const ArrowUp = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);

export default RecentSearches;