import React from 'react';
import { Truck, Tag, Shield, Info } from 'lucide-react';

const NotificationItem = ({ data }) => {
  
  // Logic to decide Icon & Color based on Type
  const getStyle = (type) => {
    switch (type) {
      case 'order': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: Truck };
      case 'promo': return { bg: 'bg-orange-50', text: 'text-orange-600', icon: Tag };
      case 'account': return { bg: 'bg-green-50', text: 'text-green-600', icon: Shield };
      default: return { bg: 'bg-gray-100', text: 'text-gray-500', icon: Info };
    }
  };

  const style = getStyle(data.type);
  const Icon = style.icon;

  return (
    <div className={`
      flex gap-3 p-4 bg-white border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors
      ${!data.read ? 'bg-blue-50/30' : ''} 
    `}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
           <h3 className={`text-sm ${!data.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
             {data.title}
           </h3>
           <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{data.time}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {data.message}
        </p>
      </div>

      {/* Unread Dot */}
      {!data.read && (
        <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mt-1.5 shrink-0"></div>
      )}
    </div>
  );
};

export default NotificationItem;