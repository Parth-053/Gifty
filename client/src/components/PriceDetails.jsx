const PriceDetails = ({ total }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-semibold mb-3">Price Details</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className="text-green-600">FREE</span>
        </div>

        <div className="flex justify-between font-semibold text-base border-t pt-2">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
