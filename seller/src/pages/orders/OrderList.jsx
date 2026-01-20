import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Eye, Clock, Package, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { fetchSellerOrders } from '../../store/orderSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatRelativeTime } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], loading} = useSelector((state) => state.order || {});

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium italic">Fetching your boutique orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Orders Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and track your customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">#{order.orderId || 'ORD-NEW'}</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium uppercase tracking-tight">
                            <Clock size={10} /> {formatRelativeTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{order.userId?.fullName || 'Guest User'}</p>
                      <p className="text-xs text-gray-500">{order.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">
                      {formatPrice(order.sellerTotal || order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Package size={40} className="text-gray-200" />
                       <p className="text-gray-400 italic text-sm font-medium">No orders found in your boutique.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;