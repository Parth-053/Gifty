import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

export const adminDashboard = async (req, res) => {
  const users = await User.countDocuments({ role: "user" });
  const sellers = await User.countDocuments({ role: "seller" });
  const products = await Product.countDocuments();
  const orders = await Order.countDocuments();

  res.json({
    users,
    sellers,
    products,
    orders,
  });
};
