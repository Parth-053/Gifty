import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails, updateOrderStatus } from '../../store/orderSlice';
import { ArrowLeft, User, MapPin, CreditCard, Loader as Spinner } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder: order, loading } = useSelector((state) => state.orders);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) return <div className="p-10 text-center"><Spinner className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
               <ArrowLeft size={20} />
            </button>
            <div>
               <h1 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h1>
               <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600">Status:</span>
            <select 
              value={order.orderStatus}
              onChange={handleStatusChange}
              disabled={updating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold outline-none cursor-pointer disabled:opacity-70"
            >
               <option value="pending">Pending</option>
               <option value="processing">Processing</option>
               <option value="shipped">Shipped</option>
               <option value="delivered">Delivered</option>
               <option value="cancelled">Cancelled</option>
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
                        {/* Assuming item has product details populated */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            {/* Placeholder image if not populated */}
                            <img src={item.productId?.images?.[0]?.url || "https://placehold.co/100"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-sm font-bold text-gray-800">{item.productId?.name || "Product Name"}</h4>
                           <p className="text-xs text-gray-500">Seller: <span className="text-blue-600">{item.sellerId?.storeName || "Seller"}</span></p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                           <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="p-4 bg-gray-50/30 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total Paid</span><span>₹{order.totalAmount}</span>
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
                     <p className="text-sm font-bold text-gray-800">{order.userId?.name}</p>
                     <p className="text-xs text-gray-500">{order.userId?.email}</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                    <p>{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-2">Payment Info</h3>
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard size={16} className="text-green-600" />
                  {order.paymentMethod || "Online"}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OrderDetails;