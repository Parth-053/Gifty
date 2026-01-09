import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Address from "../models/address.model.js";
import ApiError from "../utils/apiError.js";
import { httpStatus, OrderStatus, PaymentStatus } from "../utils/constants.js";

/**
 * Create a new order from Cart
 * Uses Transactions to ensure Atomicity (All or Nothing)
 * @param {String} userId
 * @param {Object} orderData - { addressId, paymentMethod }
 * @returns {Promise<Object>} Created Order
 */
export const createOrder = async (userId, orderData) => {
  const { addressId, paymentMethod } = orderData;
  
  // Start a MongoDB Session for Transaction
  const session = await mongoose.startSession();
  
  try {
    let orderResult = null;

    // 🔥 Transaction Block
    await session.withTransaction(async () => {
      
      // 1. Fetch User's Cart
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart || cart.items.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
      }

      // 2. Fetch & Validate Address
      const address = await Address.findOne({ _id: addressId, userId });
      if (!address) {
        throw new ApiError(httpStatus.NOT_FOUND, "Delivery address not found");
      }

      // 3. Prepare Order Items & Calculate Total
      let totalAmount = 0;
      const orderItems = [];
      const bulkStockUpdates = [];

      for (const item of cart.items) {
        const product = item.productId; // Populated product doc

        if (!product) {
          throw new ApiError(httpStatus.BAD_REQUEST, `Product not found for one of the cart items`);
        }

        // Check Stock Availability (Real-time check)
        const availableStock = product.stock - product.reservedStock;
        if (availableStock < item.quantity) {
          throw new ApiError(
            httpStatus.BAD_REQUEST, 
            `Insufficient stock for product: ${product.name}`
          );
        }

        // Calculate Price (Use discountPrice if available, else standard price)
        // Ensure we handle cases where discountPrice might be null/0
        const finalPrice = (product.discountPrice && product.discountPrice > 0) 
          ? product.discountPrice 
          : product.price;

        totalAmount += finalPrice * item.quantity;

        // Push to order items array (Snapshotting data)
        orderItems.push({
          productId: product._id,
          nameSnapshot: product.name,
          priceSnapshot: finalPrice,
          quantity: item.quantity,
          selectedCustomizations: item.selectedCustomizations || {}
        });

        // Prepare bulk update to reserve stock
        bulkStockUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { reservedStock: item.quantity } }
          }
        });
      }

      // 4. Execute Bulk Stock Reservation
      // We reserve stock now. It gets permanently deducted ONLY when payment is confirmed (or shipped).
      if (bulkStockUpdates.length > 0) {
        await Product.bulkWrite(bulkStockUpdates, { session });
      }

      // 5. Create Order Document
      const [newOrder] = await Order.create([{
        userId,
        items: orderItems,
        totalAmount,
        addressSnapshot: address.toObject(), // Freeze address
        paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PLACED
      }], { session });

      orderResult = newOrder;

      // 6. Clear Cart
      await Cart.findOneAndDelete({ userId }, { session });
    });

    // End Session
    await session.endSession();
    return orderResult;

  } catch (error) {
    await session.endSession();
    throw error; // Pass error to controller
  }
};

/**
 * Get Order by ID
 * @param {String} orderId
 * @param {String} userId - To ensure user can only see their own order
 */
export const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId })
    .populate("items.productId", "name images slug") // Populate minimal product info for UI
    .lean();

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

/**
 * Get User's Order History (with Pagination)
 */
export const getUserOrders = async (userId, query) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;

  const filter = { userId };
  if (status) {
    filter.orderStatus = status;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 }) // Latest first
    .skip(skip)
    .limit(Number(limit))
    .populate("items.productId", "images") // Show images in order list
    .lean();

  const total = await Order.countDocuments(filter);

  return {
    orders,
    meta: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Cancel Order
 * Reverses stock reservation
 */
export const cancelOrder = async (orderId, userId) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Find Order
      const order = await Order.findOne({ _id: orderId, userId }).session(session);

      if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
      }

      // Restrict cancellation if already shipped
      if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.orderStatus)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Cannot cancel this order at this stage");
      }

      // 2. Update Order Status
      order.orderStatus = OrderStatus.CANCELLED;
      await order.save({ session });

      // 3. Restore Stock (Reverse the reservation)
      const bulkStockRestores = order.items.map(item => ({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { reservedStock: -item.quantity } }
        }
      }));

      await Product.bulkWrite(bulkStockRestores, { session });
    });
    
    await session.endSession();
    return true;

  } catch (error) {
    await session.endSession();
    throw error;
  }
};

/**
 * Update Order Status (Admin/Seller Only)
 * Used to move order from Placed -> Packed -> Shipped
 */
export const updateOrderStatus = async (orderId, status) => {
  // Simple status update, but if status becomes "Shipped" or "Delivered",
  // we might want to move 'reservedStock' to permanently deducted 'stock'.
  // For simplicity here, we just update status.
  
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true }
  );
  
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  
  return order;
};