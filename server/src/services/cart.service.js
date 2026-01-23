import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Get User Cart (with calculated totals)
 */
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate("items.productId", "name price discountPrice stock images slug");

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  // Calculate Totals dynamically & Filter invalid items
  let cartTotal = 0;
  
  const validItems = cart.items.filter(item => item.productId); // Remove null products
  
  const formattedItems = validItems.map((item) => {
    const product = item.productId;
    const price = product.discountPrice || product.price;
    const subtotal = price * item.quantity;
    
    cartTotal += subtotal;

    return {
      _id: item._id,
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url,
      price: price,
      stock: product.stock,
      quantity: item.quantity,
      customizationDetails: item.customizationDetails || [], // Updated field
      subtotal
    };
  });

  return { 
    _id: cart._id, 
    items: formattedItems, 
    cartTotal 
  };
};

/**
 * Add Item to Cart
 */
export const addToCart = async (userId, { productId, quantity, customizationDetails }) => {
  // 1. Check Product Stock
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  // 2. Check if item exists (matching Product ID AND Customization)
  const itemIndex = cart.items.findIndex((item) => {
    const isSameProduct = item.productId.toString() === productId;
    
    // Compare customizations (Arrays must match exactly)
    const currentCust = JSON.stringify(item.customizationDetails || []);
    const newCust = JSON.stringify(customizationDetails || []);
    
    return isSameProduct && currentCust === newCust;
  });

  if (itemIndex > -1) {
    // Update Quantity
    const newQuantity = cart.items[itemIndex].quantity + quantity;
    if (newQuantity > product.stock) throw new ApiError(400, "Quantity exceeds stock");
    cart.items[itemIndex].quantity = newQuantity;
  } else {
    // Add New Item
    cart.items.push({ 
      productId, 
      quantity, 
      customizationDetails: customizationDetails || [] 
    });
  }

  await cart.save();
  return getCart(userId);
};

/**
 * Update Cart Item Quantity
 */
export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  if (quantity <= 0) {
    // Remove item if quantity is 0
    return removeFromCart(userId, productId);
  }

  const item = cart.items.find((item) => item.productId.toString() === productId);
  if (item) {
    // Verify stock again
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) throw new ApiError(400, `Only ${product.stock} items available`);
    
    item.quantity = quantity;
    await cart.save();
  }

  return getCart(userId);
};

/**
 * Remove Item from Cart
 */
export const removeFromCart = async (userId, itemId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter((item) => item.productId.toString() !== itemId && item._id.toString() !== itemId);
  
  await cart.save();
  return getCart(userId);
};

/**
 * Clear Cart
 */
export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ userId }, { items: [] });
  return { items: [], cartTotal: 0 };
};