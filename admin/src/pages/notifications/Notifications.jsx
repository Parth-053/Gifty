import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAllAsRead } from "../../store/notificationSlice";
import { 
  BellIcon, 
  CheckCircleIcon, 
  ShoppingBagIcon, 
  UserPlusIcon, 
  ArchiveBoxIcon 
} from "@heroicons/react/24/outline";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllAsRead());
    }
  };

  // Helper to get icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "ORDER": return <ShoppingBagIcon className="h-6 w-6 text-blue-500" />;
      case "NEW_USER":
      case "NEW_SELLER": return <UserPlusIcon className="h-6 w-6 text-green-500" />;
      case "INVENTORY": return <ArchiveBoxIcon className="h-6 w-6 text-purple-500" />;
      default: return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading && notifications.length === 0) return <div className="h-96 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Alerts about orders, users, and system events.</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkRead} variant="secondary">
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`p-4 rounded-xl border flex gap-4 transition-all ${
                !notif.isRead 
                  ? "bg-blue-50 border-blue-200 shadow-sm" // Highlight Unread
                  : "bg-white border-gray-100" // Normal Read
              }`}
            >
              <div className={`p-3 rounded-full h-fit ${!notif.isRead ? "bg-white" : "bg-gray-50"}`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-base font-semibold ${!notif.isRead ? "text-blue-900" : "text-gray-900"}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${!notif.isRead ? "text-blue-800" : "text-gray-600"}`}>
                  {notif.message}
                </p>
              </div>
              
              {!notif.isRead && (
                <div className="self-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <CheckCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;