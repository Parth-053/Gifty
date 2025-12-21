const steps = ["pending", "confirmed", "shipped", "delivered"];

const OrderStatusTimeline = ({ status }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-semibold mb-3">Order Status</h2>

      <div className="space-y-3">
        {steps.map((step) => {
          const done =
            steps.indexOf(step) <= steps.indexOf(status);

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  done ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span
                className={`text-sm capitalize ${
                  done ? "text-green-700" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
