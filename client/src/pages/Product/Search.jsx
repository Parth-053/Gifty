import React, { useState } from 'react';
import { Search as SearchIcon, ArrowLeft, X, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Use separate hook
import { useCart } from '../../hooks/useCart';

// Full Dummy Data for Search
const SEARCH_DB = [
  { id: 'p1', name: "Personalized LED Lamp", category: "Decor", price: 999, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300", rating: 4.5 },
  { id: 'p2', name: "Couple Mug Set", category: "Kitchen", price: 499, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300", rating: 4.8 },
  { id: 'p3', name: "Red Roses Bouquet", category: "Flowers", price: 599, image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=300", rating: 4.2 },
  { id: 'p4', name: "Custom T-Shirt", category: "Fashion", price: 699, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", rating: 4.0 },
];

const Search = () => {
  const navigate = useNavigate();
  
  // ✅ Fix: Get addToCart from useCart hook
  const { addToCart } = useCart();
  
  const [query, setQuery] = useState('');

  const results = query.trim() === '' ? [] : SEARCH_DB.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    alert("Added to Cart!");
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      
      {/* Search Header */}
      <div className="bg-white p-3 shadow-sm sticky top-0 z-30 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500"><ArrowLeft size={24} /></button>
        <div className="flex-1 bg-gray-100 rounded-lg flex items-center px-3 py-2.5">
           <SearchIcon size={18} className="text-gray-400" />
           <input 
             type="text" value={query} onChange={(e) => setQuery(e.target.value)}
             placeholder="Search for gifts..."
             className="bg-transparent border-none outline-none text-sm w-full ml-2"
             autoFocus
           />
           {query && <button onClick={() => setQuery('')}><X size={16} className="text-gray-400" /></button>}
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
             {results.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer active:scale-95 transition-transform"
                >
                   <div className="h-40 bg-gray-50 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="p-3">
                      <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                         <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="bg-gray-900 text-white p-2 rounded-lg active:scale-90 transition-transform"
                         >
                            <ShoppingCart size={14} />
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        ) : query ? (
          <div className="text-center mt-10 text-gray-400 text-sm">No results found</div>
        ) : (
          <div className="text-center mt-10 text-gray-400 text-sm">Type to search...</div>
        )}
      </div>
    </div>
  );
};

export default Search;