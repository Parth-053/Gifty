import React, { useEffect, useState } from 'react';
import { ArrowLeft, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CouponCard from '../../components/user/CouponCard';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';

const MyCoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get('/user/coupons'); // Create this endpoint in backend or use generic coupons
        setCoupons(response.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-gray-900">My Coupons</h1>
      </div>

      {loading ? (
        <Loader />
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Ticket size={40} />
          </div>
          <p className="text-gray-500 font-bold">No coupons available right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {coupons.map((coupon) => (
            <CouponCard key={coupon._id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoupons;