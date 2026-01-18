import React, { useState } from 'react';
import { ArrowLeft, Plus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Import correct component
import PaymentCard from '../../components/user/PaymentCard';

const PaymentMethods = () => {
  const navigate = useNavigate();

  const [methods, setMethods] = useState([
    { id: 1, type: 'Card', name: 'HDFC Bank Credit Card', detail: '**** **** **** 4242' },
    { id: 2, type: 'UPI', name: 'Google Pay', detail: 'arjun@oksbi' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Remove this payment method?")) {
      setMethods(methods.filter(m => m.id !== id));
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
          <h1 className="text-lg font-bold text-gray-800">Payment Methods</h1>
        </div>
        <button className="text-[#FF6B6B] text-sm font-bold flex items-center gap-1">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Saved Cards & UPI</h3>
        {methods.map(method => (
          <PaymentCard key={method.id} method={method} onDelete={handleDelete} />
        ))}

        <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 rounded-xl text-blue-700">
           <ShieldCheck size={20} className="shrink-0 mt-0.5" />
           <div>
             <h4 className="text-sm font-bold">100% Secure Payments</h4>
             <p className="text-xs opacity-80 mt-1">Your card details are encrypted and secure. We do not store your CVV.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;