import React from 'react';
import { Search, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchHeader = ({ query, setQuery }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-30 flex items-center gap-3 border-b border-gray-100">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-gray-500 active:scale-90 transition-transform"
      >
        <ArrowLeft size={24} />
      </button>
      
      {/* Input Field Area */}
      <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#FF6B6B]/20 focus-within:bg-white focus-within:shadow-sm">
         <Search size={18} className="text-gray-400" />
         
         <input 
           type="text" 
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="Search 'Birthday Gift'..."
           className="bg-transparent border-none outline-none text-sm w-full ml-3 text-gray-800 placeholder-gray-400"
           autoFocus // 🔥 Keyboard opens automatically
         />
         
         {/* Clear Button (Visible only when typing) */}
         {query.length > 0 && (
           <button onClick={() => setQuery('')} className="p-1">
             <X size={16} className="text-gray-400 bg-gray-200 rounded-full p-0.5" />
           </button>
         )}
      </div>
    </div>
  );
};

export default SearchHeader;