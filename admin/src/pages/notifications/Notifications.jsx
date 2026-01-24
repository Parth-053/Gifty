import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchNotifications, 
  markNotificationsRead, 
  deleteNotification 
} from "../../store/notificationSlice";
import { 
  CheckCircleIcon, 
  TrashIcon, 
  BellIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { format } from "date-fns";

const Notifications = () => {
  const dispatch = useDispatch();
  const { items, loading, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      dispatch(markNotificationsRead());
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      dispatch(deleteNotification(id));
    }
  };

  // Helper to get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "alert":
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your system alerts and updates.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <CheckCircleIcon className="h-5 w-5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-6 transition-colors hover:bg-gray-50 flex gap-4 ${
                  !notification.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className={`p-2 rounded-full ${!notification.isRead ? "bg-white" : "bg-gray-100"}`}>
                    {getIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={`text-base font-semibold ${
                      !notification.isRead ? "text-gray-900" : "text-gray-700"
                    }`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {notification.createdAt ? format(new Date(notification.createdAt), 'MMM d, h:mm a') : "Just now"}
                    </span>
                  </div>
                  
                  <p className={`mt-1 text-sm ${
                    !notification.isRead ? "text-gray-800" : "text-gray-500"
                  }`}>
                    {notification.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 self-center ml-2">
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No notifications yet"
            description="When you get alerts, they will show up here."
            icon={BellIcon}
          />
        )}
      </div>
    </div>
  );
};

export default Notifications;