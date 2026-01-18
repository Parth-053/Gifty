import { Wishlist } from "../../models/Wishlist.model.js"; 
import { Product } from "../../models/Product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * @desc    Get User's Wishlist
 * @route   GET /api/v1/wishlist
 */
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ userId: req.user._id })
    .populate({
      path: "products",
      select: "name price discountPrice images slug stock isCustomizable rating",
    });

  if (!wishlist) {
    return res.status(200).json(new ApiResponse(200, [], "Wishlist is empty"));
  }

  // Filter out null products (deleted products)
  const validProducts = wishlist.products.filter(product => product !== null);

  return res
    .status(200)
    .json(new ApiResponse(200, validProducts, "Wishlist fetched successfully"));
});

/**
 * @desc    Toggle Wishlist Item (Add/Remove)
 * @route   POST /api/v1/wishlist/toggle
 */
export const toggleWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // 1. Check Product Validity
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // 2. Find or Create Wishlist
  let wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
  }

  // 3. Add or Remove Logic
  const isAdded = wishlist.products.includes(productId);
  let message = "";

  if (isAdded) {
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    message = "Product removed from wishlist";
  } else {
    wishlist.products.push(productId);
    message = "Product added to wishlist";
  }

  await wishlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { isAdded: !isAdded }, message));
});