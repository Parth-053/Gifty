import Cart from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Get User Cart (with calculated totals)
 */
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate("items.productId", "name price discountPrice stock images slug");

  if (!cart) {
    // Create empty cart if not exists
    cart = await Cart.create({ userId, items: [] });
  }

  // Calculate Totals dynamically
  let cartTotal = 0;
  const items = cart.items.map((item) => {
    const product = item.productId;
    // Handle if product was deleted
    if (!product) return null; 

    const price = product.discountPrice || product.price;
    const subtotal = price * item.quantity;
    cartTotal += subtotal;

    return {
      ...item.toObject(),
      subtotal
    };
  }).filter(Boolean); // Remove null items

  return { _id: cart._id, items, cartTotal };
};

/**
 * Add Item to Cart
 */
export const addToCart = async (userId, { productId, quantity, customization }) => {
  // 1. Check Product Stock
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  // 2. Check if item exists
  const itemIndex = cart.items.findIndex((item) => 
    item.productId.toString() === productId && 
    JSON.stringify(item.customization) === JSON.stringify(customization) // Separate items if customization differs
  );

  if (itemIndex > -1) {
    // Update Quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add New Item
    cart.items.push({ productId, quantity, customization });
  }

  await cart.save();
  return getCart(userId); // Return formatted cart
};

/**
 * Remove/Update Item
 */
export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  if (quantity <= 0) {
    // Remove item
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  } else {
    // Update quantity
    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (item) item.quantity = quantity;
  }

  await cart.save();
  return getCart(userId);
};

export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ userId }, { items: [] });
};