import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Banknote, Wallet, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Use separate hook
import { useCart } from '../../hooks/useCart'; 

const Payment = () => {
  const navigate = useNavigate();
  const { cartTotal } = useCart(); // Use real total
  const [method, setMethod] = useState('upi');

  const finalAmount = Math.max(0, cartTotal - 50); // Same discount logic as Cart.jsx

  const handlePayment = () => {
    // Navigate to Success Page
    navigate('/checkout/success');
  };

  const methods = [
    { id: 'upi', name: "UPI (Google Pay / PhonePe)", icon: Wallet },
    { id: 'card', name: "Credit / Debit Card", icon: CreditCard },
    { id: 'cod', name: "Cash on Delivery", icon: Banknote },
  ];

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">Payment</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Amount Section */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 text-center">
           <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Payable</p>
           <h2 className="text-3xl font-extrabold text-gray-900 mt-1">₹{finalAmount}</h2>
        </div>

        {/* Methods */}
        <div>
           <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Payment Options</h3>
           <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {methods.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-none hover:bg-gray-50 ${method === m.id ? 'bg-blue-50/50' : ''}`}
                >
                   <div className={`p-2 rounded-full ${method === m.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <m.icon size={18} />
                   </div>
                   <span className={`flex-1 text-sm font-semibold ${method === m.id ? 'text-blue-700' : 'text-gray-700'}`}>
                     {m.name}
                   </span>
                   <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-blue-500' : 'border-gray-300'}`}>
                      {method === m.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-xs font-bold">
           <ShieldCheck size={16} /> 100% Safe & Secure Payment
        </div>

      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] border-t border-gray-100 z-30">
         <button 
           onClick={handlePayment}
           className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
         >
            Pay Now
         </button>
      </div>
    </div>
  );
};

export default Payment;