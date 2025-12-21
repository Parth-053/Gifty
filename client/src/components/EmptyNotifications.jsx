const EmptyNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
      <div className="text-4xl mb-2">🔔</div>
      <p>No notifications yet</p>
      <p className="text-sm">
        We’ll notify you when something arrives
      </p>
    </div>
  );
};

export default EmptyNotifications;
