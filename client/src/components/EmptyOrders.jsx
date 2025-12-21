const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
      <div className="text-4xl mb-2">📦</div>
      <p>No orders yet</p>
      <p className="text-sm">
        Your orders will appear here
      </p>
    </div>
  );
};

export default EmptyOrders;
