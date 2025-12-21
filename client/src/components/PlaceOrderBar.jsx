const PlaceOrderBar = ({ onPlaceOrder }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
      <button
        onClick={onPlaceOrder}
        className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold"
      >
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrderBar;
