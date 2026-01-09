import React from 'react';
import { ChevronRight, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Status Colors Helper
const getStatusStyle = (status) => {
  switch (status) {
    case 'Delivered': return { color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle };
    case 'Shipped': return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Truck };
    case 'Processing': return { color: 'text-orange-600 bg-orange-50 border-orange-100', icon: Clock };
    case 'Cancelled': return { color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle };
    default: return { color: 'text-gray-600 bg-gray-50 border-gray-100', icon: Package };
  }
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  
  // ✅ FIX: Safety check to prevent crash
  if (!order) return null;

  const { color, icon: StatusIcon } = getStatusStyle(order.status);

  // ✅ FIX: Handle data structure correctly (Supports both styles)
  // Agar 'items' array hai (New style) to uska pehla item lo, nahi to direct order object (Old style) use karo
  const image = order.items ? order.items[0].image : order.image;
  const name = order.items ? order.items[0].name : order.productName;
  const moreItemsCount = order.items ? order.items.length - 1 : (order.moreItems || 0);

  const handleCardClick = () => {
    // Agar id '#' se start hoti hai to use hata do URL ke liye
    const cleanId = order.id.replace('#', '');
    navigate(`/account/orders/${cleanId}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 active:scale-[0.99] transition-transform cursor-pointer"
    >
      
      {/* Header: Date & Status */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[10px] text-gray-400 font-medium">ORDER ID: {order.id}</p>
          <p className="text-xs font-bold text-gray-800 mt-0.5">{order.date}</p>
        </div>
        <div className={`px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold border ${color}`}>
          <StatusIcon size={12} />
          {order.status.toUpperCase()}
        </div>
      </div>

      {/* Body: Image & Details */}
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          {moreItemsCount > 0 && (
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
               +{moreItemsCount}
             </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{name}</h3>
          {moreItemsCount > 0 && (
            <p className="text-[10px] text-gray-500">and {moreItemsCount} more items</p>
          )}
          <p className="text-sm font-bold text-[#FF6B6B] mt-1">₹{order.total}</p>
        </div>

        {/* Arrow Icon */}
        <div className="flex items-center text-gray-300">
          <ChevronRight size={20} />
        </div>
      </div>

      {/* Footer Button */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex gap-3">
        {order.status === 'Delivered' ? (
           <span className="w-full py-2 text-center text-xs font-bold text-[#FF6B6B] bg-[#FF6B6B]/5 rounded-lg">
             Write Review
           </span>
        ) : (
           <span className="w-full py-2 text-center text-xs font-bold text-gray-600 bg-gray-50 rounded-lg">
             View Details
           </span>
        )}
      </div>

    </div>
  );
};

export default OrderCard;