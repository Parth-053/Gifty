import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Download, MapPin } from 'lucide-react';
import { fetchOrderById, clearCurrentOrder } from '../../store/orderSlice';
import OrderTracker from '../../components/user/OrderTracker';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => dispatch(clearCurrentOrder());
  }, [dispatch, id]);

  if (loading || !order) return <Loader fullScreen />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900">Order #{order._id.slice(-8)}</h1>
            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
          <Download size={20} />
        </button>
      </div>

      {/* Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
        <OrderTracker status={order.status} />
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Items ({order.items.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="p-4 flex gap-4">
              <img 
                src={item.product?.images?.[0]?.url} 
                alt={item.product?.name} 
                className="w-20 h-20 rounded-xl object-cover bg-gray-50 border border-gray-100"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{item.product?.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                {item.variant && <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">{item.variant}</span>}
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-gray-400" /> Delivery Address
          </h3>
          <p className="text-sm font-bold text-gray-800">{order.shippingAddress?.fullName}</p>
          <p className="text-sm text-gray-500 leading-relaxed mt-1">
            {order.shippingAddress?.street},<br/>
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br/>
            Phone: {order.shippingAddress?.phone}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
              <span>Grand Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="mt-2 pt-2">
               <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentInfo?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                 Payment: {order.paymentInfo?.status?.toUpperCase()}
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;