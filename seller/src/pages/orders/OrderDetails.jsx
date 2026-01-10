import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, MapPin, Phone, Mail, Package, Truck, CheckCircle } from 'lucide-react';
import Toast from '../../components/common/Toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Pending');
  const [toast, setToast] = useState(null);

  // Dummy Data
  const order = {
    id: id || 'ORD-7829',
    date: 'Oct 24, 2025, 10:30 AM',
    customer: {
      name: 'Amit Sharma',
      email: 'amit@example.com',
      phone: '+91 98765 43210',
      address: '123, Green Park, Civil Lines, Jaipur, Rajasthan - 302006'
    },
    items: [
      { name: 'Personalized Mug', price: 499, qty: 2, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=100' },
      { name: 'Custom Keychain', price: 199, qty: 1, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100' }
    ],
    payment: { method: 'Cash on Delivery', subtotal: 1197, tax: 50, shipping: 0, total: 1247 }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setToast({ type: 'success', message: `Order status updated to ${e.target.value}` });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* 1. Header */}
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
         <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
               <Printer size={16} /> Invoice
            </button>
            <select 
              value={status} 
              onChange={handleStatusChange}
              className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold outline-none cursor-pointer hover:bg-blue-700"
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
         
         {/* 2. Left Col: Items & Payment */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-800">Order Items <span className="text-gray-500 font-normal">({order.items.length})</span></h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                     <div key={idx} className="p-4 flex items-center gap-4">
                        <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1">
                           <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                           <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</p>
                     </div>
                  ))}
               </div>
               
               {/* Totals */}
               <div className="p-4 bg-gray-50/30 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                     <span>Subtotal</span>
                     <span>₹{order.payment.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                     <span>Tax</span>
                     <span>₹{order.payment.tax}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                     <span>Shipping</span>
                     <span>{order.payment.shipping === 0 ? 'Free' : `₹${order.payment.shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                     <span>Total</span>
                     <span>₹{order.payment.total}</span>
                  </div>
               </div>
            </div>

         </div>

         {/* 3. Right Col: Customer & Status */}
         <div className="space-y-6">
            
            {/* Customer Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
               <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Customer Details</h3>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                     {order.customer.name.charAt(0)}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
                     <p className="text-xs text-gray-500">Customer since 2024</p>
                  </div>
               </div>
               <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                     <Mail size={16} className="text-gray-400 shrink-0" />
                     <span className="break-all">{order.customer.email}</span>
                  </div>
                  <div className="flex gap-3">
                     <Phone size={16} className="text-gray-400 shrink-0" />
                     <span>{order.customer.phone}</span>
                  </div>
                  <div className="flex gap-3">
                     <MapPin size={16} className="text-gray-400 shrink-0" />
                     <span className="leading-relaxed">{order.customer.address}</span>
                  </div>
               </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
               <h3 className="font-bold text-gray-800 mb-2">Payment Info</h3>
               <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                  {order.payment.method}
               </p>
            </div>

         </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default OrderDetails;