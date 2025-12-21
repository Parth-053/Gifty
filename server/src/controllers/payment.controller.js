import Order from "../models/Order.model.js";

/* =========================
   DUMMY PAYMENT SUCCESS
   ========================= */
export const markPaymentSuccess = async (req, res) => {
  const { orderId } = req.body;

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "paid",
    status: "confirmed",
  });

  res.json({ message: "Payment successful (dummy)" });
};
