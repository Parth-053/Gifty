import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, ShoppingBag } from 'lucide-react';

const UserDetails = () => {
  const navigate = useNavigate();
  // Dummy User
  const user = {
    id: 1,
    name: "Amit Sharma",
    email: "amit@example.com",
    phone: "+91 98765 43210",
    role: "Customer",
    status: "Active",
    ordersCount: 12,
    totalSpent: "₹15,400"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
         <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
               {user.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
               <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
               {user.status}
            </span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl">
               <p className="text-xs text-gray-500 font-bold uppercase">Total Orders</p>
               <p className="text-xl font-bold text-gray-900">{user.ordersCount}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
               <p className="text-xs text-gray-500 font-bold uppercase">Total Spent</p>
               <p className="text-xl font-bold text-gray-900">{user.totalSpent}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserDetails;