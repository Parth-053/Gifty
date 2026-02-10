import { Product } from "../../models/Product.model.js";
import * as imageService from "../../services/image.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Products (Admin View)
 * @route   GET /api/v1/admin/products
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  const filter = {};

  if (search) filter.name = { $regex: search, $options: "i" };
  if (status) filter.verificationStatus = status;

  const products = await Product.find(filter)
    .populate("sellerId", "storeName email")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { products, total }, "All products fetched")
  );
});

/**
 * @desc    Hard Delete Product (Admin Only)
 * @route   DELETE /api/v1/admin/products/:id
 */
export const deleteProductAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // 1. Delete Images from Cloudinary (HARD DELETE)
  if (product.images && product.images.length > 0) {
    try {
      await imageService.deleteImages(product.images);
    } catch (error) {
      console.error("Cloudinary Delete Error:", error);
    }
  }

  // 2. Remove from DB (HARD DELETE)
  await product.deleteOne();

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { id: req.params.id }, "Product permanently deleted")
  );
});