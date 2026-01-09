import React, { useState } from 'react';
import { Ticket, ArrowRight } from 'lucide-react';

const CouponInput = () => {
  const [code, setCode] = useState('');

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 mt-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
         <Ticket size={14} /> Apply Coupon
      </h3>
      <div className="flex gap-2">
        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-[#FF6B6B] transition-colors flex items-center">
           <input 
             type="text" 
             value={code}
             onChange={(e) => setCode(e.target.value.toUpperCase())}
             placeholder="ENTER CODE"
             className="bg-transparent text-sm font-bold w-full outline-none placeholder-gray-400 uppercase"
           />
        </div>
        <button className="bg-gray-900 text-white px-4 rounded-lg font-bold text-xs disabled:opacity-50" disabled={!code}>
           APPLY
        </button>
      </div>
    </div>
  );
};

export default CouponInput;