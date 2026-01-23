import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderDetails, updateOrderStatus } from "../../store/orderSlice";
import { ArrowLeftIcon, MapPinIcon, CreditCardIcon, TruckIcon } from "@heroicons/react/24/outline";

// Components
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder: order, loading,  } = useSelector((state) => state.orders);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) setNewStatus(order.orderStatus);
  }, [order]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.orderStatus) return;
    
    setStatusUpdating(true);
    await dispatch(updateOrderStatus({ id: order._id, status: newStatus }));
    setStatusUpdating(false);
  };

  if (loading || !order) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" text="Loading order details..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/orders")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)} • via {order.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Status Update Control */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-700 ml-2">Status:</span>
            <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={statusUpdating}
            >
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <Button 
                size="sm" 
                onClick={handleStatusUpdate}
                isLoading={statusUpdating}
                disabled={newStatus === order.orderStatus}
            >
                Update
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Items & Payment */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Order Items */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Order Items ({order.items.length})</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                        <li key={index} className="p-6 flex flex-col sm:flex-row gap-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                            <div className="flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.name}</h3>
                                        <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity} x {formatCurrency(item.price)}</p>
                                    
                                    {/* Customization Details Display */}
                                    {item.customizationDetails && item.customizationDetails.length > 0 && (
                                        <div className="mt-3 bg-gray-50 p-3 rounded-md border border-dashed border-gray-300">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Customization</p>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                {item.customizationDetails.map((custom, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span>{custom.optionName}: <span className="font-medium">{custom.value}</span></span>
                                                        {custom.additionalPrice > 0 && (
                                                            <span className="text-xs text-gray-500">+{formatCurrency(custom.additionalPrice)}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Seller ID: {item.sellerId}</p>
                                    <Badge variant={item.status === 'returned' ? 'danger' : 'success'}>
                                        {item.status || "Normal"}
                                    </Badge>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Payment Info */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Payment Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-900 capitalize">{order.paymentMethod}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Payment Status</p>
                        <Badge 
                            variant={order.paymentInfo?.status === "paid" ? "success" : "warning"}
                        >
                            {order.paymentInfo?.status?.toUpperCase()}
                        </Badge>
                    </div>
                    {order.paymentInfo?.razorpayPaymentId && (
                        <div className="col-span-2">
                            <p className="text-gray-500">Transaction ID</p>
                            <p className="font-mono text-gray-900">{order.paymentInfo.razorpayPaymentId}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-6">
            
            {/* Customer Info */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {order.userId?.fullName?.charAt(0) || "G"}
                    </div>
                    <h3 className="font-semibold text-gray-900">Customer</h3>
                </div>
                <div className="text-sm space-y-3">
                    <div>
                        <p className="text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{order.userId?.fullName || "Guest"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{order.userId?.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{order.shippingAddress?.phone}</p>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                </div>
                <address className="not-italic text-sm text-gray-600 leading-6">
                    <span className="font-medium text-gray-900">{order.shippingAddress?.fullName}</span><br />
                    {order.shippingAddress?.addressLine1}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                    {order.shippingAddress?.pincode}
                </address>
                {/* Courier Info if Available */}
                {(order.courierPartner || order.trackingId) && (
                     <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <TruckIcon className="h-4 w-4 text-gray-400" />
                            <h4 className="font-medium text-gray-900">Delivery Info</h4>
                        </div>
                        <p className="text-xs text-gray-500">Partner: {order.courierPartner || "N/A"}</p>
                        <p className="text-xs text-gray-500">Tracking: {order.trackingId || "N/A"}</p>
                     </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span>{formatCurrency(order.shippingAmount)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(order.discountAmount)}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between font-bold text-gray-900 text-base">
                        <span>Total</span>
                        <span>{formatCurrency(order.finalAmount)}</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;