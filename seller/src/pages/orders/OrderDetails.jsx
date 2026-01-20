import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Printer, MapPin, Phone, Mail, Package, Clock, CheckCircle } from 'lucide-react';
import { fetchOrderById, updateOrderState } from '../../store/orderSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatDateTime } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder: order, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  const handleStatusUpdate = async (newStatus) => {
    const result = await dispatch(updateOrderState({ orderId: id, status: newStatus }));
    if (updateOrderState.fulfilled.match(result)) {
      toast.success(`Order marked as ${newStatus}`);
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  if (loading || !order) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h1>
            <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        
        {/* Status Actions */}
        <div className="flex gap-2">
          {order.orderStatus === 'pending' && (
            <button onClick={() => handleStatusUpdate('processing')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">Accept Order</button>
          )}
          {order.orderStatus === 'processing' && (
            <button onClick={() => handleStatusUpdate('shipped')} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">Mark Shipped</button>
          )}
          <button onClick={() => window.print()} className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600"><Printer size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Package size={18} /> Items Summary</h3>
              <span className="text-sm font-bold text-blue-600">{order.items?.length} Items</span>
            </div>
            <div className="p-5 divide-y divide-gray-50">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                  <img src={item.product?.image} alt={item.product?.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-800">{item.product?.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-bold text-gray-900">{formatPrice(item.quantity * item.price)}</p>
                </div>
              ))}
            </div>
            {/* Bill Summary */}
            <div className="p-5 bg-gray-50/50 border-t border-gray-50 space-y-2">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{formatPrice(order.totalAmount)}</span></div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100"><span>Total Earning</span><span>{formatPrice(order.totalAmount)}</span></div>
            </div>
          </div>
        </div>

        {/* Right: Customer & Shipping */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-3">Customer Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                {order.user?.name?.charAt(0)}
              </div>
              <p className="text-sm font-bold text-gray-800">{order.user?.name}</p>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3"><Mail size={16} className="text-gray-400" /> {order.user?.email}</div>
              <div className="flex gap-3"><Phone size={16} className="text-gray-400" /> {order.shippingAddress?.phone}</div>
              <div className="flex gap-3"><MapPin size={16} className="text-gray-400" /> <span className="leading-tight">{order.shippingAddress?.addressLine}, {order.shippingAddress?.city}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;