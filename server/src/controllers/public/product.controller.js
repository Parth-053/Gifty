import { 
  queryProducts, 
  getProductById 
} from "../../services/product.service.js";
import { trackEvent } from "../../services/analytics.service.js";
import Category from "../../models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";

/**
 * @desc    Browse & Search Products (Public)
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  // 1. Separate Filters from Pagination Options
  const { 
    page, limit, sortBy, sortOrder, // Pagination & Sorting
    ...filters // Everything else (search, minPrice, category, tags, rating)
  } = req.query;

  const options = { 
    page: Number(page) || 1, 
    limit: Number(limit) || 12,
    sortBy: sortBy || "createdAt",
    sortOrder: sortOrder || "desc"
  };

  // 2. Call Service
  const result = await queryProducts(filters, options);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, result, "Products fetched successfully"));
});

/**
 * @desc    Get Single Product Details
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Fetch Product (Service handles "Not Found" error)
  const product = await getProductById(id);

  // 2. 🔥 Analytics: Track "View" Event
  // We don't await this because we don't want to slow down the user's response.
  // This is called "Fire and Forget".
  trackEvent("product", product._id, "views").catch(err => 
    console.error("Analytics Error (Ignored):", err.message)
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, "Product details fetched"));
});

/**
 * @desc    Get All Categories (For Navigation Menu)
 * @route   GET /api/v1/products/categories
 * @access  Public
 */
export const getPublicCategories = asyncHandler(async (req, res) => {
  // Only fetch active categories
  const categories = await Category.find({ isActive: true })
    .select("name slug parentId")
    .sort({ name: 1 })
    .lean();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, categories, "Categories fetched"));
});