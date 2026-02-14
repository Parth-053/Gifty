import React, { useRef, useEffect } from 'react';
import { ArrowLeft, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchHeader = ({ query, setQuery, onSubmit, autoFocus = false }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSubmit) onSubmit();
    }
  };

  return (
    // THEME FIX: Uses your Gifty Gradient (Blue -> Purple)
    <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <div className="flex items-center gap-3 p-3">
        
        {/* Back Button (White) */}
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products..."
            // Input is white text on transparent background with white placeholder for cleaner look on gradient
            // OR kept as white box for high contrast. Kept as white box as per standard e-com.
            className="w-full bg-white text-gray-900 text-[15px] font-medium rounded-lg py-2.5 pl-10 pr-10 border-none focus:ring-2 focus:ring-purple-300 transition-all placeholder-gray-400 shadow-inner"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;