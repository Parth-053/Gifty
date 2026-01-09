import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Correct path to CouponCard
import CouponCard from '../../components/user/CouponCard';

const MyCoupons = () => {
  const navigate = useNavigate();

  const coupons = [
    { id: 1, code: "WELCOME50", discount: "50%", title: "New User Bonus", desc: "Get flat 50% off on your first personalized gift order above ₹500.", expiry: "30 Jan 2026" },
    { id: 2, code: "LOVE20", discount: "20%", title: "Valentine Special", desc: "Flat 20% off on all Couple Mugs and Cushions.", expiry: "14 Feb 2026" },
    { id: 3, code: "FREESHIP", discount: "FREE", title: "Free Shipping", desc: "Zero delivery charges on orders above ₹999.", expiry: "31 Mar 2026" },
  ];

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">My Coupons</h1>
      </div>

      <div className="p-4">
        {coupons.map(coupon => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}

        <div className="mt-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Add New Coupon</h3>
          <div className="flex gap-2">
            <input type="text" placeholder="Enter Coupon Code" className="flex-1 bg-white p-3 rounded-xl border border-gray-200 outline-none text-sm uppercase font-bold" />
            <button className="bg-gray-900 text-white px-5 rounded-xl text-xs font-bold">ADD</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoupons;