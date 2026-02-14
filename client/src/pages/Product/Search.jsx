import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending, fetchSuggestions, clearSuggestions } from '../../store/searchSlice';
import SearchHeader from '../../components/search/SearchHeader';
import RecentSearches from '../../components/search/RecentSearches';
import { Search as SearchIcon, ArrowUpLeft } from 'lucide-react';

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [query, setQuery] = useState('');
  
  // Redux Data
  const { trending, suggestions } = useSelector((state) => state.search || {});

  // Local Storage History
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    dispatch(fetchTrending());
  }, [dispatch]);

  // Handle Typing
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        dispatch(fetchSuggestions(query));
      } else {
        dispatch(clearSuggestions());
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query, dispatch]);

  // --- GO TO RESULTS PAGE ---
  const handleSubmit = (text) => {
    if (!text.trim()) return;
    
    // Save to History
    const updated = [text, ...recentSearches.filter(t => t !== text)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // Navigate to dedicated results page
    navigate(`/search/results?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <SearchHeader 
        query={query} 
        setQuery={setQuery} 
        onSubmit={() => handleSubmit(query)}
        autoFocus={true}
      />

      <div className="flex-1 overflow-y-auto">
        {!query ? (
          <div className="pb-20">
            <RecentSearches 
              recent={recentSearches} 
              trending={trending} 
              onSelect={handleSubmit}
              onClear={() => {
                setRecentSearches([]);
                localStorage.removeItem('recentSearches');
              }}
            />
          </div>
        ) : (
          <div className="bg-white">
            {suggestions?.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleSubmit(item.text)}
                className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 cursor-pointer group"
              >
                <SearchIcon size={16} className="text-gray-400 group-hover:text-purple-600" />
                <span className="text-gray-700 text-[15px] font-medium flex-1">{item.text}</span>
                <ArrowUpLeft size={16} className="text-gray-300 -rotate-45" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;