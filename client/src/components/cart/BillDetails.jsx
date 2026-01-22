import React from 'react';
import { useSelector } from 'react-redux';
import { formatPrice } from '../../utils/formatCurrency';

const BillDetails = () => {
  const { totalAmount, items } = useSelector((state) => state.cart);

  // Calculate Derived Values (Backend typically sends these, but we can calculate for UI speed)
  const subtotal = totalAmount;
  const shipping = subtotal > 999 ? 0 : 50; // Example Logic: Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18); // Example: 18% GST (Adjust logic as per backend)
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping Fee</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-bold">Free</span>
          ) : (
            <span className="font-medium text-gray-900">{formatPrice(shipping)}</span>
          )}
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax (GST 18%)</span>
          <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 my-4" />

        <div className="flex justify-between items-end">
          <span className="font-bold text-gray-900 text-base">Total Amount</span>
          <span className="font-black text-xl text-blue-600">{formatPrice(finalTotal)}</span>
        </div>
      </div>
      
      <div className="mt-4 bg-blue-50 p-3 rounded-xl text-xs text-blue-700 font-medium text-center">
        🎉 You are saving on shipping for this order!
      </div>
    </div>
  );
};

export default BillDetails;