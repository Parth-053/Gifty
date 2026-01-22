import React, { useEffect, useState } from 'react';
import { ArrowLeft, BellOff, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationItem from '../../components/user/NotificationItem';
import Loader from '../../components/common/Loader';
import api from '../../api/axios';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/user/notifications');
      setNotifications(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/user/notifications/read-all');
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    } catch {
      console.error("Failed to mark all read");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <button onClick={markAllRead} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <BellOff size={32} />
          </div>
          <p className="text-gray-500 font-bold">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationItem key={notif._id} notification={notif} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;