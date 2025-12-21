import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

/* =========================
   SELLER DASHBOARD
   ========================= */
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Total products by seller
    const totalProducts = await Product.countDocuments({
      sellerId,
    });

    // Orders that include seller's products
    const orders = await Order.find({
      "items.sellerId": sellerId,
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);

    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    res.status(200).json({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   SELLER PROFILE
   ========================= */
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user.id).select(
      "-password -emailOTP -otpExpiresAt"
    );

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const updates = req.body;

    const seller = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   SELLER PRODUCTS
   ========================= */

// GET all products of seller
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD product
export const addSellerProduct = async (req, res) => {
  try {
    const images = req.files?.map((file) => file.path) || [];

    const product = await Product.create({
      title: req.body.title?.trim(),
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      images,
      sellerId: req.user.id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: error.message });
  }
};


// UPDATE product
export const updateSellerProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        sellerId: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE product
export const deleteSellerProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   SELLER ORDERS
   ========================= */

// GET seller orders
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({
      "items.sellerId": sellerId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE order status (shipped / delivered)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      "items.sellerId": req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   SELLER ANALYTICS
   ========================= */
export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({
      "items.sellerId": sellerId,
      status: { $in: ["confirmed", "shipped", "delivered"] },
    });

    const totalEarnings = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const monthlyRevenue = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      monthlyRevenue[month] =
        (monthlyRevenue[month] || 0) + order.totalAmount;
    });

    res.status(200).json({
      totalEarnings,
      totalOrders: orders.length,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

