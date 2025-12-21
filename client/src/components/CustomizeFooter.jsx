const CustomizeFooter = () => {
  return (
    <div className="fixed bottom-14 left-0 right-0 bg-white border-t p-4 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-600">Total Price</span>
        <span className="text-lg font-semibold">₹1299</span>
      </div>

      <button className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold">
        Add to Cart
      </button>
    </div>
  );
};

export default CustomizeFooter;
