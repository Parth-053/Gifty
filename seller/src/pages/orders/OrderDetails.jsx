import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails, updateItemStatus, clearCurrentOrder } from "../../store/orderSlice";
import { formatPrice } from "../../utils/formatPrice";
import { formatDateTime } from "../../utils/formatDate";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { ArrowLeftIcon, MapPinIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
    return () => { dispatch(clearCurrentOrder()); };
  }, [dispatch, id]);

  const handleStatusChange = (itemId, newStatus) => {
    dispatch(updateItemStatus({ orderId: id, itemId, status: newStatus }));
  };

  if (loading || !currentOrder) {
    return <div className="h-96 flex items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/orders")} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{currentOrder.orderId}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDateTime(currentOrder.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {currentOrder.items.map((item) => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover object-center" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    
                    {/* Status Update Controls */}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-sm text-gray-600">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processed">Processed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Badge variant={
                        item.status === 'delivered' ? 'success' : 
                        item.status === 'cancelled' ? 'danger' : 'warning'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
              <span className="font-medium text-gray-900">Total Earnings</span>
              <span className="font-bold text-xl text-indigo-600">{formatPrice(currentOrder.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right: Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Customer Details</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {currentOrder.user?.fullName?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentOrder.user?.fullName}</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                {currentOrder.user?.email}
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                {currentOrder.user?.phone || "N/A"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Shipping Address</h3>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p>{currentOrder.shippingAddress?.addressLine1}</p>
                {currentOrder.shippingAddress?.addressLine2 && <p>{currentOrder.shippingAddress?.addressLine2}</p>}
                <p>
                  {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state}
                </p>
                <p className="font-medium">{currentOrder.shippingAddress?.pincode}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;