import React, { useEffect, useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentCard from '../../components/user/PaymentCard';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setMethods([
          { _id: '1', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2028, name: 'John Doe' },
          { _id: '2', brand: 'mastercard', last4: '8899', expMonth: 10, expYear: 2026, name: 'John Doe' }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  const handleDelete = (id) => {
    if(window.confirm("Remove this card?")) {
      setMethods(methods.filter(m => m._id !== id));
      toast.success("Card removed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Payment Methods</h1>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {methods.map((method) => (
              <PaymentCard key={method._id} method={method} onDelete={handleDelete} />
            ))}
          </div>
          
          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex flex-col items-center gap-2">
            <CreditCard size={24} />
            Add New Card
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;