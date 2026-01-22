import React, { useState } from 'react';
import { Tag, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios'; // Direct API call for coupons usually better than Redux store storage

const CouponInput = ({ onCouponApplied }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      // API Call: POST /api/v1/cart/coupon
      const response = await api.post('/cart/apply-coupon', { code });
      setApplied(response.data.data); // Coupon Details
      onCouponApplied && onCouponApplied(response.data.data);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid Coupon Code');
      setApplied(null);
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setCode('');
    setApplied(null);
    onCouponApplied && onCouponApplied(null);
    toast.success('Coupon removed');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-4">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Tag size={18} className="text-blue-600" />
        Apply Coupon
      </h3>

      {applied ? (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-700">{applied.code}</p>
              <p className="text-xs text-green-600">Saved ₹{applied.discountAmount}</p>
            </div>
          </div>
          <button 
            onClick={removeCoupon}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code (e.g. SAVE20)"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 uppercase placeholder:normal-case transition-all"
          />
          <button 
            type="submit"
            disabled={loading || !code}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CouponInput;