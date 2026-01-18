import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(1);

  // Dummy Addresses
  const addresses = [
    { id: 1, type: "HOME", name: "Arjun Sharma", text: "402, Krishna Residency, MP Nagar, Bhopal, 462001", phone: "9876543210" },
    { id: 2, type: "OFFICE", name: "Arjun Work", text: "Tech Park, Sector 5, Indore, 452010", phone: "9123456780" },
  ];

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-24">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">Select Address</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Add New Address Button */}
        <button className="w-full bg-white p-4 rounded-xl border border-dashed border-[#FF6B6B] text-[#FF6B6B] font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
           <Plus size={18} /> Add New Address
        </button>

        {/* Address List */}
        {addresses.map((addr) => (
          <div 
            key={addr.id}
            onClick={() => setSelectedId(addr.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${selectedId === addr.id ? 'bg-white border-[#FF6B6B] shadow-sm' : 'bg-white border-transparent'}`}
          >
            <div className="flex items-start gap-3">
               <div className="mt-1 text-gray-400"><MapPin size={20} /></div>
               <div className="flex-1">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{addr.type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mt-2">{addr.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.text}</p>
                  <p className="text-xs text-gray-500 mt-1 font-semibold">Phone: {addr.phone}</p>
               </div>
            </div>
            
            {/* Selection Tick */}
            {selectedId === addr.id && (
               <div className="absolute top-4 right-4 text-[#FF6B6B]">
                  <CheckCircle size={20} className="fill-current" />
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] border-t border-gray-100 z-30">
         <button 
           onClick={() => navigate('/checkout/payment')}
           className="w-full bg-[#FF6B6B] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#FF6B6B]/30 active:scale-95 transition-transform"
         >
            Deliver Here
         </button>
      </div>

    </div>
  );
};

export default CheckoutAddress;