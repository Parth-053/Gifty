import { useEffect, useState } from "react";
import API_URL from "../config/api";

import NotificationsHeader from "../components/NotificationsHeader";
import NotificationItem from "../components/NotificationItem";
import EmptyNotifications from "../components/EmptyNotifications";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <NotificationsHeader />

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          notifications.map((item) => (
            <NotificationItem
              key={item._id}
              notification={item}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
