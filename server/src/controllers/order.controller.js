import Cart from "../models/Cart.model.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

/* =========================
   PLACE ORDER (CHECKOUT)
   ========================= */
export const placeOrder = async (req, res) => {
  const { address } = req.body;

  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    "items.productId"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.productId;

    totalAmount += product.price * item.quantity;

    orderItems.push({
      productId: product._id,
      sellerId: product.sellerId,
      quantity: item.quantity,
      price: product.price,
      customizationData: item.customizationData,
    });
  }

  const order = await Order.create({
    userId: req.user.id,
    items: orderItems,
    totalAmount,
    address,
  });

  // 🔥 CLEAR CART AFTER ORDER
  await Cart.findOneAndDelete({ userId: req.user.id });

  res.status(201).json({
    message: "Order placed successfully",
    orderId: order._id,
  });
};

/* =========================
   USER: MY ORDERS
   ========================= */
export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(orders);
};

/* =========================
   SELLER: MY ORDERS
   ========================= */
export const getSellerOrders = async (req, res) => {
  const orders = await Order.find({
    "items.sellerId": req.user.id,
  });

  res.json(orders);
};
