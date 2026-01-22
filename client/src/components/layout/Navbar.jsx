import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Removed useDispatch as sidebar is gone
import { Search, ShoppingCart, Heart, LogIn } from 'lucide-react'; // Removed Menu
import { APP_NAME } from '../../utils/constants';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${query}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Logo (No Hamburger Menu) */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter">
            {APP_NAME}<span className="text-blue-600">.</span>
          </Link>
        </div>

        {/* Center: Search Bar (Hidden on mobile, visible on md+) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-full transition-all text-sm outline-none"
            />
            <Search className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Mobile Search Icon */}
          <button 
            onClick={() => navigate('/shop')} 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <Search size={22} />
          </button>

          {/* Wishlist (Visible on Desktop) */}
          <Link to="/user/wishlist" className="hidden sm:flex p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <Heart size={22} />
          </Link>

          {/* Cart Icon (Visible on all screens) */}
          <Link to="/cart" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition-all">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <Link to="/user/profile" className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-gray-900">{user?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-500">My Account</p>
              </div>
            </Link>
          ) : (
            <Link to="/auth/login" className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-black transition-all ml-2">
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;