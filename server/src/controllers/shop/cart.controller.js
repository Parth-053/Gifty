import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as cartService from "../../services/cart.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Current User's Cart
 * @route   GET /api/v1/shop/cart
 */
export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, cart, "Cart fetched successfully"));
});

/**
 * @desc    Add Item to Cart
 * @route   POST /api/v1/shop/cart/add
 */
export const addItemToCart = asyncHandler(async (req, res) => {
  // customizationDetails is now an Array based on backend 2.0 schema
  const { productId, quantity, customizationDetails } = req.body;

  const cart = await cartService.addToCart(req.user._id, {
    productId,
    quantity,
    customizationDetails
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, cart, "Item added to cart"));
});

/**
 * @desc    Update Item Quantity
 * @route   PUT /api/v1/shop/cart/update
 */
export const updateItemQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  const cart = await cartService.updateCartItem(req.user._id, productId, quantity);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, cart, "Cart updated successfully"));
});

/**
 * @desc    Remove Item from Cart
 * @route   DELETE /api/v1/shop/cart/:productId
 */
export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, cart, "Item removed from cart"));
});

/**
 * @desc    Clear Cart
 * @route   DELETE /api/v1/shop/cart
 */
export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Cart cleared successfully"));
});