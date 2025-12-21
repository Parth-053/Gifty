const PaymentMethods = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-semibold mb-3">
        Payment Method
      </h2>

      <div className="space-y-3 text-sm">
        <label className="flex items-center gap-3">
          <input type="radio" name="payment" />
          UPI / Google Pay / PhonePe
        </label>

        <label className="flex items-center gap-3">
          <input type="radio" name="payment" />
          Credit / Debit Card
        </label>

        <label className="flex items-center gap-3">
          <input type="radio" name="payment" />
          Cash on Delivery
        </label>
      </div>
    </div>
  );
};

export default PaymentMethods;
