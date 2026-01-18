import * as cartService from "../../services/cart.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

/**
 * @desc    Get Current User's Cart
 * @route   GET /api/v1/cart
 */
export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

/**
 * @desc    Add Product to Cart
 * @route   POST /api/v1/cart/add
 */
export const addItemToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

/**
 * @desc    Update Quantity or Remove
 * @route   PUT /api/v1/cart/update
 */
export const updateItemQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
  return res.status(200).json(new ApiResponse(200, cart, "Cart updated"));
});