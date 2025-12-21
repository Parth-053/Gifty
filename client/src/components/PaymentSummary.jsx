const PaymentSummary = ({ order }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-semibold mb-3">
        Payment Summary
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Item Total</span>
          <span>₹{order.totalAmount}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-green-600">FREE</span>
        </div>

        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Total Paid</span>
          <span>₹{order.totalAmount}</span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Paid via Online
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;
