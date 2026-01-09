import React from 'react';
import { FileText } from 'lucide-react';

const BillDetails = ({ subtotal, discount, total }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 mt-4 mb-24 shadow-sm">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
         <FileText size={14} /> Bill Details
      </h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
           <span>Item Total</span>
           <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-green-600">
           <span>Product Discount</span>
           <span>- ₹{discount}</span>
        </div>
        <div className="flex justify-between">
           <span>Delivery Fee</span>
           <span className="text-green-600 font-bold">FREE</span>
        </div>
        <div className="h-px bg-gray-100 my-2 border-dashed border-t"></div>
        <div className="flex justify-between font-extrabold text-base text-gray-900">
           <span>To Pay</span>
           <span>₹{total}</span>
        </div>
      </div>
      
      <div className="mt-3 bg-green-50 text-green-700 text-[10px] font-bold px-3 py-2 rounded-lg text-center border border-green-100">
         Yay! You saved ₹{discount} on this order 🎉
      </div>
    </div>
  );
};

export default BillDetails;