import React, { useState } from 'react';
import { ArrowLeft, BellOff, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Import correct component
import NotificationItem from '../../components/user/NotificationItem';

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', title: 'Order Delivered', message: 'Your customized mug (Order #98212) has been delivered successfully.', time: '2h ago', read: false },
    { id: 2, type: 'promo', title: '50% Off Sale!', message: 'Valentine special sale is live. Get flat 50% off on couple gifts.', time: '5h ago', read: false },
    { id: 3, type: 'account', title: 'Login Alert', message: 'New login detected from iPhone 13 Pro in Mumbai.', time: '1d ago', read: true },
    { id: 4, type: 'order', title: 'Order Shipped', message: 'Your order #88321 is on the way. Track it now.', time: '2d ago', read: true },
  ]);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const clearAll = () => {
    if(window.confirm("Clear all notifications?")) {
      setNotifications([]);
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
           <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
        </div>
        
        {notifications.length > 0 && (
           <div className="flex gap-3">
              <button onClick={markAllRead} className="text-blue-600 text-[10px] font-bold flex items-center gap-1">
                 <CheckCheck size={14} /> READ ALL
              </button>
              <button onClick={clearAll} className="text-gray-400 text-[10px] font-bold">
                 CLEAR
              </button>
           </div>
        )}
      </div>

      <div className="p-0">
        {notifications.length > 0 ? (
          <div className="bg-white mt-2 border-y border-gray-100">
             {notifications.map(item => (
                <NotificationItem key={item.id} data={item} />
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-32 opacity-60">
             <div className="bg-gray-100 p-6 rounded-full mb-4">
                <BellOff size={40} className="text-gray-400" />
             </div>
             <h3 className="text-sm font-bold text-gray-800">No new notifications</h3>
             <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
      
      {notifications.length > 4 && (
        <p className="text-center text-[10px] text-gray-400 mt-6 mb-10">Showing last 30 days activity</p>
      )}
    </div>
  );
};

export default Notifications;