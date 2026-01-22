import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';

const getStatusVariant = (status) => {
  switch (status) {
    case 'Delivered': return 'success';
    case 'Processing': return 'info';
    case 'Shipped': return 'warning';
    case 'Cancelled': return 'danger';
    default: return 'neutral';
  }
};

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      
      {/* Header: Order ID & Status */}
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order #{order._id.slice(-8)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {order.status}
        </Badge>
      </div>

      {/* Body: Items Preview */}
      <div className="p-4 flex gap-4 items-center">
        {/* Product Images (Show max 3) */}
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={item._id || index} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden relative shadow-sm">
              {item.product?.images?.[0]?.url ? (
                <img 
                  src={item.product.images[0].url} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package size={16} />
                </div>
              )}
            </div>
          ))}
          {/* Overflow Counter */}
          {order.items.length > 3 && (
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 pl-2">
          <p className="text-sm font-bold text-gray-900">
            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-xs">
            {order.items[0]?.product?.name} {order.items.length > 1 && '...'}
          </p>
        </div>

        {/* Total Price (Desktop) */}
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-400">Total Amount</p>
          <p className="text-lg font-black text-gray-900">{formatPrice(order.totalAmount)}</p>
        </div>
      </div>

      {/* Footer: Action */}
      <Link 
        to={`/user/orders/${order._id}`}
        className="block bg-gray-50 p-3 text-center text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 group-hover:text-blue-700"
      >
        View Order Details <ChevronRight size={16} />
      </Link>
    </div>
  );
};

export default OrderCard;