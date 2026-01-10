import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Package, CreditCard, Truck } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Pending');

  // Dummy Data
  const order = {
    id: id || 'ORD-7829',
    date: 'Oct 24, 2025',
    status: 'Pending',
    customer: { name: 'Amit Sharma', email: 'amit@example.com', phone: '+91 98765 43210' },
    shippingAddress: '123, Green Park, Civil Lines, Jaipur, Rajasthan - 302006',
    items: [
      { name: 'Personalized Mug', price: 499, qty: 2, seller: 'TechWorld', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=100' },
      { name: 'Custom Keychain', price: 199, qty: 1, seller: 'GiftHub', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100' }
    ],
    payment: { method: 'Online (Razorpay)', subtotal: 1197, tax: 50, total: 1247 }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
               <ArrowLeft size={20} />
            </button>
            <div>
               <h1 className="text-xl font-bold text-gray-800">Order #{order.id}</h1>
               <p className="text-xs text-gray-500">{order.date}</p>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600">Status:</span>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold outline-none cursor-pointer"
            >
               <option value="Pending">Pending</option>
               <option value="Processing">Processing</option>
               <option value="Shipped">Shipped</option>
               <option value="Delivered">Delivered</option>
               <option value="Cancelled">Cancelled</option>
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left Col: Items */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-800">Items ({order.items.length})</h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                     <div key={idx} className="p-4 flex items-center gap-4">
                        <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1">
                           <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                           <p className="text-xs text-gray-500">Seller: <span className="text-blue-600">{item.seller}</span></p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                           <p className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</p>
                        </div>
                     </div>
                  ))}
               </div>
               {/* Totals */}
               <div className="p-4 bg-gray-50/30 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{order.payment.subtotal}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span>₹{order.payment.tax}</span></div>
                  <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                     <span>Total Paid</span><span>₹{order.payment.total}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Col: Customer Info */}
         <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
               <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Customer Details</h3>
               <div className="flex items-start gap-3">
                  <User size={18} className="text-gray-400 mt-0.5" />
                  <div>
                     <p className="text-sm font-bold text-gray-800">{order.customer.name}</p>
                     <p className="text-xs text-gray-500">{order.customer.email}</p>
                     <p className="text-xs text-gray-500">{order.customer.phone}</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress}</p>
               </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-2">Payment Info</h3>
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard size={16} className="text-green-600" />
                  {order.payment.method}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default OrderDetails;