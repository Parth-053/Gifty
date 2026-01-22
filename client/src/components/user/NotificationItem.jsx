import React from 'react';
import { Bell, Info, Package, Tag, CreditCard } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate';

const getIcon = (type) => {
  switch (type) {
    case 'order': return { icon: Package, color: 'bg-blue-100 text-blue-600' };
    case 'promo': return { icon: Tag, color: 'bg-purple-100 text-purple-600' };
    case 'payment': return { icon: CreditCard, color: 'bg-green-100 text-green-600' };
    default: return { icon: Bell, color: 'bg-gray-100 text-gray-600' };
  }
};

const NotificationItem = ({ notification, onClick }) => {
  const { icon: Icon, color } = getIcon(notification.type);

  return (
    <div 
      onClick={onClick}
      className={`
        p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors flex gap-4 cursor-pointer relative overflow-hidden
        ${!notification.isRead ? 'bg-blue-50/30' : ''}
      `}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />
      )}

      <div className={`p-3 rounded-xl h-fit flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      
      <div className="flex-1 pr-4">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-sm ${!notification.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
            {notification.title}
          </h4>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ml-2">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;