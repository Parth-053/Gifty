import Order from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";

/**
 * Create Order (Direct Buy or Cart Checkout)
 */
export const createOrder = async (userId, { items, address, paymentMethod }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let orderItems = [];
    let totalAmount = 0;

    // 1. Process Each Item (Fetch REAL Price & Check Stock)
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Out of stock: ${product.name}`);
      }

      // Security: Use DB Price, NOT Frontend Price
      const finalPrice = product.discountPrice || product.price;

      // Create Snapshot (Immutable record of what was bought)
      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        image: product.images[0]?.url,
        price: finalPrice,
        quantity: item.quantity,
        customization: item.customization,
        status: "pending"
      });

      totalAmount += finalPrice * item.quantity;

      // Deduct Stock (Atomic Operation)
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // 2. Create Order
    // Generate Random Order ID 
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create([{
      orderId,
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress: address,
      paymentMethod,
      paymentInfo: {
        status: paymentMethod === "cod" ? "pending" : "pending" // If online, updated via webhook later
      }
    }], { session });

    // 3. Clear Cart if success
    await Cart.findOneAndUpdate({ userId }, { items: [] }).session(session);

    await session.commitTransaction();
    session.endSession();

    return order[0];

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Get User Orders
 */
export const getUserOrders = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};