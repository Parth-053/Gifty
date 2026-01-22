import React from 'react';
import { useAuth } from '../../hooks/useAuth'; // Uses Redux internally
import { Sparkles, MapPin } from 'lucide-react';

const TopHeader = () => {
  const { user, isAuthenticated } = useAuth();

  // Get first name or default to 'Guest'
  const firstName = user?.name?.split(' ')[0] || 'Guest';

  return (
    <div className="flex justify-between items-end mb-6 pt-2 px-1">
      <div>
        <div className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
          <MapPin size={12} />
          <span>Delivering to India</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
          {isAuthenticated ? `Hi, ${firstName} 👋` : "Welcome to Gifty 👋"}
        </h1>
      </div>
      
      {/* Promo/Status Badge */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-gray-200 hover:bg-black transition-all cursor-pointer">
        <Sparkles size={16} className="text-yellow-400" />
        <span className="text-sm font-bold">New Offers</span>
      </div>
    </div>
  );
};

export default TopHeader;