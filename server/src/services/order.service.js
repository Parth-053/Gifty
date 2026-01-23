import mongoose from "mongoose";
import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { Cart } from "../models/Cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOrderId } from "../utils/helpers.js";

/**
 * Create Order
 * Handles Stock Deduction, Price Verification, and Snapshotting
 */
export const createOrder = async (userId, { items, shippingAddress, paymentMethod }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
      
      // 1. Stock Check
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Out of stock: ${product.name}`);
      }

      // 2. Price Check (Always use DB price)
      const price = product.discountPrice || product.price;

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        image: product.images[0]?.url,
        price: price,
        quantity: item.quantity, 
        customizationDetails: item.customizationDetails || [], 
        status: "pending"
      });

      totalAmount += price * item.quantity;

      // 3. Deduct Stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // 4. Create Order
    const orderId = generateOrderId();  
    
    const order = await Order.create([{
      orderId,
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress, // Embedded object
      paymentMethod,
      paymentInfo: {
        status: paymentMethod === "cod" ? "pending" : "pending"
      }
    }], { session });

    // 5. Clear Cart
    await Cart.findOneAndUpdate({ userId }, { items: [] }).session(session);

    await session.commitTransaction();
    return order[0];

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get User Orders
 */
export const getUserOrders = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  
  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
    
  const total = await Order.countDocuments({ userId });
  
  return { orders, total };
};

/**
 * Get Order Details
 */
export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate("items.productId", "slug");
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};