import { Wishlist } from "../models/Wishlist.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Toggle Wishlist Item (Add/Remove)
 */
export const toggleWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [] });
  }

  const index = wishlist.products.indexOf(productId);

  if (index === -1) {
    // Add
    wishlist.products.push(productId);
    await wishlist.save();
    return { message: "Added to wishlist", isAdded: true };
  } else {
    // Remove
    wishlist.products.splice(index, 1);
    await wishlist.save();
    return { message: "Removed from wishlist", isAdded: false };
  }
};

/**
 * Get User Wishlist (Populated)
 */
export const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId })
    .populate("products", "name price discountPrice images slug stock");
  
  return wishlist ? wishlist.products : [];
};