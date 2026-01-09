import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../../services/cart.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import { httpStatus } from "../../utils/constants.js";

/**
 * @desc    Get Cart
 * @route   GET /api/v1/cart
 */
export const getUserCart = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user._id);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, cart, "Cart fetched"));
});

/**
 * @desc    Add Item
 * @route   POST /api/v1/cart/add
 */
export const addItemToCart = asyncHandler(async (req, res) => {
  const cart = await addToCart(req.user._id, req.body); // body has {productId, quantity...}
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, cart, "Item added to cart"));
});

/**
 * @desc    Update Item Quantity
 * @route   PATCH /api/v1/cart/update
 */
export const updateItemQuantity = asyncHandler(async (req, res) => {
  const cart = await updateCartItem(req.user._id, req.body);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, cart, "Cart updated"));
});

/**
 * @desc    Remove Item
 * @route   DELETE /api/v1/cart/remove
 */
export const removeItem = asyncHandler(async (req, res) => {
  // Using body for delete payload is supported in modern clients
  const cart = await removeFromCart(req.user._id, req.body);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, cart, "Item removed"));
});

/**
 * @desc    Clear Cart
 * @route   DELETE /api/v1/cart/clear
 */
export const clearUserCart = asyncHandler(async (req, res) => {
  await clearCart(req.user._id);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, "Cart cleared"));
});