import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as wishlistService from "../../services/wishlist.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Wishlist
 * @route   GET /api/v1/user/wishlist
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const products = await wishlistService.getWishlist(req.user._id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, products, "Wishlist fetched successfully"));
});

/**
 * @desc    Toggle Wishlist Item (Add/Remove)
 * @route   POST /api/v1/user/wishlist/toggle
 */
export const toggleWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product ID is required");
  }

  const result = await wishlistService.toggleWishlist(req.user._id, productId);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, result, result.message));
});