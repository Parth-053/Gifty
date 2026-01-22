import React, { useState } from 'react';
import { Copy, Check, TicketPercent } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date(coupon.expirationDate) < new Date();

  return (
    <div className={`relative bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col sm:flex-row shadow-sm ${isExpired ? 'opacity-60 grayscale' : ''}`}>
      
      {/* Left: Decor & Amount */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 flex flex-col items-center justify-center text-white min-w-[120px] relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 opacity-50 rotate-45 transform scale-150" />
        <TicketPercent size={32} className="mb-2 relative z-10" />
        <span className="text-2xl font-black relative z-10">
          {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `₹${coupon.discountAmount}`}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 relative z-10">OFF</span>
      </div>

      {/* Right: Details */}
      <div className="p-5 flex-1 flex flex-col justify-between relative">
        {/* Ticket Perforation Dots */}
        <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-between -ml-2 sm:flex hidden">
           {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-4 bg-[#F9FAFB] rounded-full" />)}
        </div>

        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 text-lg">{coupon.code}</h3>
            {isExpired && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded">EXPIRED</span>}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Min. purchase: <span className="font-bold text-gray-700">₹{coupon.minPurchase}</span>
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Valid until {formatDate(coupon.expirationDate)}
          </p>
        </div>

        <button 
          onClick={handleCopy}
          disabled={isExpired}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all disabled:cursor-not-allowed"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy Code"}
        </button>
      </div>
    </div>
  );
};

export default CouponCard;