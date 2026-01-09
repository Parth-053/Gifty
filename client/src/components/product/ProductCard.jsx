import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hooks Import
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  // Navigate to Details Page
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0); // Click karne par page top par khule
  };

  // Stop Propagation functions (Button dabane par page na khule)
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    alert("Added to Cart!");
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group active:scale-[0.98] transition-transform duration-300 cursor-pointer relative"
    >
      
      {/* Image Section */}
      <div className="h-40 w-full bg-gray-50 relative overflow-hidden">
        <img 
          src={product.image} // Make sure data has 'image' key
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#FF6B6B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-colors z-10 ${isWishlisted ? 'bg-red-50 text-[#FF6B6B]' : 'bg-white/80 text-gray-400 hover:text-[#FF6B6B]'}`}
        >
          <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
        </button>
      </div>
      
      {/* Details Section */}
      <div className="p-3">
        <h3 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#FF6B6B] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="bg-green-100 text-green-700 text-[10px] px-1 rounded flex items-center font-bold">
             {product.rating || 4.5} <Star size={8} className="fill-current ml-0.5" />
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews || 0})</span>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
             {product.originalPrice && (
               <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
             )}
             <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="bg-gray-900 text-white p-2 rounded-lg shadow-md active:scale-90 transition-transform hover:bg-[#FF6B6B]"
          >
             <ShoppingBag size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;