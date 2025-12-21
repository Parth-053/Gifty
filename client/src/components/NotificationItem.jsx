const NotificationItem = ({ notification }) => {
  return (
    <div
      className={`p-3 rounded-xl shadow-sm ${
        notification.isRead
          ? "bg-gray-100"
          : "bg-white"
      }`}
    >
      <h3 className="text-sm font-semibold">
        {notification.title}
      </h3>

      <p className="text-xs text-gray-600 mt-1">
        {notification.message}
      </p>
    </div>
  );
};

export default NotificationItem;
