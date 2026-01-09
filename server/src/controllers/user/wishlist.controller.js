import Wishlist from "../../models/wishlist.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ userId: req.user._id })
    .populate("products.productId", "name price images slug stock ratingAvg");

  const products = wishlist ? wishlist.products.filter(i => i.productId) : []; // Filter nulls

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, products, "Wishlist fetched"));
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  let wishlist = await Wishlist.findOne({ userId: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
  }

  // Check duplicate
  const exists = wishlist.products.find(item => item.productId.toString() === productId);
  if (exists) {
    return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, wishlist, "Already in wishlist"));
  }

  wishlist.products.push({ productId });
  await wishlist.save();

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, wishlist, "Added to wishlist"));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }
  );
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, wishlist, "Removed from wishlist"));
});