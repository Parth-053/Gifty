import React from 'react';
import { Copy } from 'lucide-react';

const CouponCard = ({ coupon }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    alert(`Coupon ${coupon.code} Copied!`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden relative flex">
      {/* Left Side: Decoration */}
      <div className="w-8 bg-[#FF6B6B] flex items-center justify-center relative">
        <div className="text-[10px] text-white font-bold -rotate-90 whitespace-nowrap tracking-widest">
          FLAT {coupon.discount} OFF
        </div>
        {/* Punch Holes Effect */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F9F9F9] rounded-full"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F9F9F9] rounded-full"></div>
      </div>

      {/* Right Side: Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <h3 className="text-sm font-bold text-gray-800">{coupon.title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{coupon.desc}</p>
        
        <div className="flex justify-between items-center mt-3 bg-gray-50 p-2 rounded-lg border border-dashed border-gray-300">
          <span className="text-xs font-bold text-gray-700 font-mono tracking-wider">{coupon.code}</span>
          <button onClick={handleCopy} className="text-[#FF6B6B] text-[10px] font-bold flex items-center gap-1">
             <Copy size={12} /> COPY
          </button>
        </div>
        
        <p className="text-[10px] text-gray-400 mt-2">Valid till: {coupon.expiry}</p>
      </div>
    </div>
  );
};

export default CouponCard;