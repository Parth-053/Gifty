import React, { useState, useEffect } from 'react';
import { Clock, X, Search } from 'lucide-react';

const RecentSearches = ({ onSearch }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setHistory(stored);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setHistory([]);
  };

  const removeItem = (e, item) => {
    e.stopPropagation();
    const updated = history.filter(i => i !== item);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
    setHistory(updated);
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Clock size={16} className="text-blue-600" /> Recent Searches
        </h3>
        <button 
          onClick={clearHistory}
          className="text-xs font-bold text-red-500 hover:text-red-600"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((term, index) => (
          <button
            key={index}
            onClick={() => onSearch(term)}
            className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
          >
            <Search size={12} className="opacity-50" />
            {term}
            <span 
              onClick={(e) => removeItem(e, term)}
              className="p-0.5 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={12} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;