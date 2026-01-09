import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";

/**
 * Get current user's cart
 * Populates product details for display
 * @param {String} userId
 * @returns {Promise<Object>}
 */
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId })
    .populate({
      path: "items.productId",
      select: "name price discountPrice images stock slug active isCustomizable"
    })
    .lean();

  if (!cart) {
    // Return empty structure if no cart exists yet (Front-end friendly)
    return { items: [], cartTotal: 0 };
  }

  // Calculate real-time totals
  let cartTotal = 0;
  
  // Filter out items where the product might have been deleted
  cart.items = cart.items.filter(item => item.productId);

  cart.items = cart.items.map((item) => {
    const product = item.productId;
    const price = (product.discountPrice && product.discountPrice > 0) 
      ? product.discountPrice 
      : product.price;

    item.subTotal = price * item.quantity;
    cartTotal += item.subTotal;
    
    return item;
  });

  cart.cartTotal = cartTotal;
  return cart;
};

/**
 * Add Item to Cart
 * Handles Quantity updates if item exists
 * @param {String} userId
 * @param {Object} itemData - { productId, quantity, selectedCustomizations }
 */
export const addToCart = async (userId, itemData) => {
  const { productId, quantity, selectedCustomizations = {} } = itemData;

  // 1. Verify Product & Stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Only ${product.stock} items left in stock`);
  }

  // 2. Find User's Cart
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // Create new cart if doesn't exist
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity, selectedCustomizations }]
    });
    return cart;
  }

  // 3. Check if item exists (matching ProductID AND Customizations)
  // We use JSON.stringify for simple object comparison of customizations
  const existingItemIndex = cart.items.findIndex((item) => {
    const isMatchProduct = item.productId.toString() === productId;
    // Handle undefined/empty customizations gracefully
    const currentCustom = item.selectedCustomizations || {};
    const newCustom = selectedCustomizations || {};
    
    const isMatchCustom = JSON.stringify(currentCustom) === JSON.stringify(newCustom);
    return isMatchProduct && isMatchCustom;
  });

  if (existingItemIndex > -1) {
    // Item exists: Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    // Check stock again for the total new quantity
    if (product.stock < newQuantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Cannot add more. Max available stock is ${product.stock}`);
    }
    
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Item is new: Push to array
    cart.items.push({ productId, quantity, selectedCustomizations });
  }

  await cart.save();
  return cart;
};

/**
 * Update Item Quantity (Increment/Decrement)
 * @param {String} userId
 * @param {Object} updateData - { productId, quantity, selectedCustomizations }
 */
export const updateCartItem = async (userId, updateData) => {
  const { productId, quantity, selectedCustomizations = {} } = updateData;

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");

  // Find the specific item
  const itemIndex = cart.items.findIndex((item) => {
    const currentCustom = item.selectedCustomizations || {};
    const targetCustom = selectedCustomizations || {};
    
    return item.productId.toString() === productId && 
           JSON.stringify(currentCustom) === JSON.stringify(targetCustom);
  });

  if (itemIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not in cart");
  }

  if (quantity <= 0) {
    // If quantity is 0 or less, remove item
    cart.items.splice(itemIndex, 1);
  } else {
    // Validate Stock before increasing
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Max stock available is ${product.stock}`);
    }
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  return cart;
};

/**
 * Remove specific item from cart
 */
export const removeFromCart = async (userId, data) => {
  const { productId, selectedCustomizations = {} } = data;

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");

  // Filter out the specific item
  cart.items = cart.items.filter((item) => {
    const currentCustom = item.selectedCustomizations || {};
    const targetCustom = selectedCustomizations || {};
    
    const isMatch = item.productId.toString() === productId && 
                    JSON.stringify(currentCustom) === JSON.stringify(targetCustom);
    return !isMatch; // Keep items that DO NOT match
  });

  await cart.save();
  return cart;
};

/**
 * Clear entire cart (e.g., after order placement)
 */
export const clearCart = async (userId) => {
  await Cart.findOneAndDelete({ userId });
  return true;
};