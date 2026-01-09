import Seller from "../models/seller.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/apiError.js";
import { httpStatus, UserRoles } from "../utils/constants.js";
import mongoose from "mongoose";

/**
 * Onboard a new Seller (Create Store Profile)
 * @param {String} userId - The ID of the user applying
 * @param {Object} sellerData - { storeName, description, phone, email, ... }
 * @returns {Promise<Object>} Created Seller Profile
 */
export const registerSeller = async (userId, sellerData) => {
  const session = await mongoose.startSession();
  
  try {
    let seller = null;
    
    await session.withTransaction(async () => {
      // 1. Check if Store Name is unique
      const existingStore = await Seller.findOne({ storeName: sellerData.storeName }).session(session);
      if (existingStore) {
        throw new ApiError(httpStatus.CONFLICT, "Store name is already taken");
      }

      // 2. Check if User already has a seller profile (by email)
      // (Assuming 1 email = 1 user = 1 seller account)
      const existingSellerEmail = await Seller.findOne({ email: sellerData.email }).session(session);
      if (existingSellerEmail) {
        throw new ApiError(httpStatus.CONFLICT, "Seller account with this email already exists");
      }

      // 3. Create Seller Document
      // We are mapping the User's ID to the Seller document conceptually via logic, 
      // but sticking to your schema's fields.
      [seller] = await Seller.create([sellerData], { session });

      // 4. Update User Role to 'seller' (or maintain 'user' until approved)
      // If your flow requires Admin Approval, you might skip this or set a specific flag.
      await User.findByIdAndUpdate(
        userId, 
        { role: UserRoles.SELLER },
        { session }
      );
    });

    await session.endSession();
    return seller;

  } catch (error) {
    await session.endSession();
    throw error;
  }
};

/**
 * Get Seller Profile (Private - for Dashboard)
 * @param {String} email - Seller's email (from logged in user)
 */
export const getSellerProfile = async (email) => {
  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, "Seller profile not found");
  }
  return seller;
};

/**
 * Get Seller Profile (Public - for Product Page)
 * Hides sensitive contact info
 * @param {String} sellerId
 */
export const getPublicSellerProfile = async (sellerId) => {
  const seller = await Seller.findById(sellerId)
    .select("storeName description logo bannerImage createdAt rating")
    .lean();

  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");
  }
  return seller;
};

/**
 * Update Seller Profile
 * @param {String} sellerId
 * @param {Object} updates
 */
export const updateSellerProfile = async (sellerId, updates) => {
  // Prevent updating critical fields like email directly here if not allowed
  delete updates.email; 
  delete updates.status; // Status changes should be Admin only

  const seller = await Seller.findByIdAndUpdate(sellerId, updates, {
    new: true,
    runValidators: true
  });

  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");
  }
  return seller;
};

/**
 * 🔥 ANALYTICS: Get Seller Dashboard Stats
 * Calculates Total Revenue, Orders, and Products
 * @param {String} sellerId
 */
export const getSellerStats = async (sellerId) => {
  // 1. Get all products belonging to this seller
  const sellerProducts = await Product.find({ sellerId }).select("_id").lean();
  const productIds = sellerProducts.map(p => p._id);

  if (productIds.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      pendingOrders: 0
    };
  }

  // 2. Aggregate Orders to find specific items sold by this seller
  // Since an Order can contain items from MULTIPLE sellers, we must $unwind and filter.
  const stats = await Order.aggregate([
    { 
      // Initial filter to find orders that contain AT LEAST one of seller's products
      $match: { "items.productId": { $in: productIds } } 
    },
    { $unwind: "$items" },
    { 
      // Filter the unwound items to keep ONLY this seller's products
      $match: { "items.productId": { $in: productIds } } 
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $multiply: ["$items.priceSnapshot", "$items.quantity"] } },
        totalItemsSold: { $sum: "$items.quantity" },
        uniqueOrdersCount: { $addToSet: "$_id" } // Count unique Order IDs
      }
    },
    {
      $project: {
        totalRevenue: 1,
        totalItemsSold: 1,
        totalOrders: { $size: "$uniqueOrdersCount" }
      }
    }
  ]);

  const result = stats[0] || { totalRevenue: 0, totalItemsSold: 0, totalOrders: 0 };

  return {
    ...result,
    totalProducts: productIds.length
  };
};

/**
 * Get All Sellers (Admin Use / Directory)
 * @param {Object} query - Pagination and Search
 */
export const getAllSellers = async (query) => {
  const { page = 1, limit = 10, search, status } = query;
  const filter = {};

  if (status) filter.status = status;
  if (search) {
    filter.storeName = { $regex: search, $options: "i" };
  }

  const sellers = await Seller.find(filter)
    .select("-email -phone") // Hide sensitive info for list view
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  const total = await Seller.countDocuments(filter);

  return {
    sellers,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit)
    }
  };
};