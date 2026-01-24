import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../store/notificationSlice";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { BellIcon, CheckCircleIcon, ShoppingBagIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatDate";

const Notifications = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case "order": return <ShoppingBagIcon className="h-6 w-6 text-blue-500" />;
      case "payout": return <BanknotesIcon className="h-6 w-6 text-green-500" />;
      default: return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((notification) => (
              <div key={notification._id} className={`p-4 flex gap-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50/50' : ''}`}>
                <div className="p-2 bg-white rounded-full border border-gray-100 shadow-sm h-fit">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No notifications" description="You're all caught up!" icon={BellIcon} />
        )}
      </div>
    </div>
  );
};

export default Notifications;