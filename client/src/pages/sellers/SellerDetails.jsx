import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, FileText, CheckCircle, Ban } from 'lucide-react';
import Button from '../../components/common/Button';

const SellerDetails = () => {
  const navigate = useNavigate();
  // Dummy Data
  const seller = {
    id: 1,
    storeName: "TechWorld",
    ownerName: "Rahul Kumar",
    email: "rahul@tech.com",
    phone: "+91 98765 43210",
    address: "123, IT Park, Bangalore",
    status: "Pending",
    gstin: "29ABCDE1234F1Z5",
    joinedDate: "12 Jan, 2024"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Seller Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left: Basic Info */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900">{seller.storeName}</h2>
                     <p className="text-sm text-gray-500">Joined on {seller.joinedDate}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">{seller.status}</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                     <User className="text-gray-400" size={20} />
                     <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Owner</p>
                        <p className="text-sm font-semibold">{seller.ownerName}</p>
                     </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                     <FileText className="text-gray-400" size={20} />
                     <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">GSTIN</p>
                        <p className="text-sm font-semibold">{seller.gstin}</p>
                     </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                     <Mail className="text-gray-400" size={20} />
                     <p className="text-sm font-medium pt-1">{seller.email}</p>
                  </div>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                     <Phone className="text-gray-400" size={20} />
                     <p className="text-sm font-medium pt-1">{seller.phone}</p>
                  </div>
               </div>
            </div>

            {/* KYC Documents Mockup */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4">KYC Documents</h3>
               <div className="flex gap-4">
                  <div className="w-32 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                     ID Proof
                  </div>
                  <div className="w-32 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                     Address Proof
                  </div>
               </div>
            </div>
         </div>

         {/* Right: Actions */}
         <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4">Admin Actions</h3>
               <div className="space-y-3">
                  <Button variant="success" className="w-full" icon={CheckCircle}>Verify Seller</Button>
                  <Button variant="danger" className="w-full" icon={Ban}>Reject Application</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SellerDetails;