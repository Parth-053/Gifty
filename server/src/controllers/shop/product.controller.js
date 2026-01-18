import { 
  getAllProducts, 
  getProductById 
} from "../../services/product.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

/**
 * @desc    Get All Products (with filters)
 * @route   GET /api/v1/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  // Pass query params (page, category, search, etc.)
  const data = await getAllProducts(req.query);
  return res.status(200).json(new ApiResponse(200, data, "Products fetched"));
});

/**
 * @desc    Get Single Product Details
 * @route   GET /api/v1/products/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  return res.status(200).json(new ApiResponse(200, product, "Product details fetched"));
});

/**
 * @desc    Get Related Products (Logic in controller for now)
 * @route   GET /api/v1/products/:id/related
 */
// ... (Can be added later)