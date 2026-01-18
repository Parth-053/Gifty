import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Import correct component
import AddressCard from '../../components/user/AddressCard';

const SavedAddresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", name: "Arjun Sharma", phone: "9876543210", fullAddress: "402, Krishna Residency, MP Nagar, Bhopal, MP - 462001" },
    { id: 2, type: "Office", name: "Arjun Work", phone: "9123456780", fullAddress: "Tech Park, Sector 5, Indore, MP - 452010" },
  ]);

  const handleDelete = (id) => {
    if(window.confirm("Delete this address?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
           <h1 className="text-lg font-bold text-gray-800">Saved Addresses</h1>
        </div>
        <button className="text-[#FF6B6B] text-sm font-bold flex items-center gap-1">
           <Plus size={16} /> Add New
        </button>
      </div>

      <div className="p-4">
        {addresses.length > 0 ? (
          addresses.map(addr => (
            <AddressCard 
              key={addr.id} 
              address={addr} 
              onDelete={handleDelete} 
              onEdit={(id) => alert(`Edit ID: ${id}`)}
            />
          ))
        ) : (
          <div className="text-center mt-20 text-gray-400 text-sm">No addresses saved.</div>
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;