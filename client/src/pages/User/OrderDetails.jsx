import React from 'react';
import { ArrowLeft, MapPin, Phone, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// ✅ Fix: Import correct component
import OrderTracker from '../../components/user/OrderTracker';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Dummy Data - In real app, find order by ID from Context/API
  const orderData = {
    id: orderId || 'ORD-98212',
    status: 'Shipped', // Try changing to 'Delivered' or 'Processing' to see Tracker change
    date: '12 Jan, 2025',
    total: 1299,
    address: {
      name: 'Arjun Sharma',
      text: 'Flat 402, Krishna Residency, MP Nagar, Bhopal, 462001',
      phone: '+91 98765 43210'
    },
    items: [
      { name: "Customized Photo Mug", price: 499, qty: 1, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=100" },
      { name: "Chocolate Hamper", price: 800, qty: 1, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100" }
    ]
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-24">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800">Order Details</h1>
          <p className="text-xs text-gray-400">ID: {orderData.id}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* 1. Tracker Section */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-2">Order Status</h2>
          <OrderTracker currentStatus={orderData.status} />
        </div>

        {/* 2. Items List */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">Items in Order</h2>
           {orderData.items.map((item, index) => (
             <div key={index} className="flex gap-3 mb-4 last:mb-0">
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                   <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                   <p className="text-sm font-bold text-[#FF6B6B]">₹{item.price}</p>
                </div>
             </div>
           ))}
        </div>

        {/* 3. Shipping Address */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
             <MapPin size={14} /> Shipping Details
           </h2>
           <h3 className="text-sm font-bold text-gray-800">{orderData.address.name}</h3>
           <p className="text-sm text-gray-600 mt-1 leading-relaxed">{orderData.address.text}</p>
           <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
             <Phone size={14} /> {orderData.address.phone}
           </p>
        </div>

        {/* 4. Payment Summary */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
           <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
             <FileText size={14} /> Payment Summary
           </h2>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{orderData.total}</span></div>
             <div className="flex justify-between text-green-600"><span>Delivery</span><span>Free</span></div>
             <div className="h-px bg-gray-100 my-1"></div>
             <div className="flex justify-between font-bold text-gray-900"><span>Grand Total</span><span>₹{orderData.total}</span></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;