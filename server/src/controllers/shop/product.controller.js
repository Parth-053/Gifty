import { 
  getAllProducts, 
  getProductById 
} from "../../services/product.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Get All Products (with filters & pagination)
 * @route   GET /api/v1/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  // Pass query params (page, category, search, minPrice, maxPrice, sort)
  const data = await getAllProducts(req.query);
  
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Products fetched successfully"));
});

/**
 * @desc    Get Single Product Details
 * @route   GET /api/v1/products/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product details fetched successfully"));
});

/**
 * @desc    Get Related Products (Based on Category)
 * @route   GET /api/v1/products/:id/related
 */
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Get current product to find its category
  // (Using getProductById ensures we handle 404 if product doesn't exist)
  const currentProduct = await getProductById(id);

  if (!currentProduct.categoryId) {
    return res.status(200).json(new ApiResponse(200, [], "No related products found"));
  }

  // 2. Fetch products from the same category
  // We fetch 5 items so that if we filter out the current one, we still have ~4
  const { products } = await getAllProducts({ 
    category: currentProduct.categoryId._id || currentProduct.categoryId, // Handle populated vs unpopulated
    limit: 5,
    page: 1
  });

  // 3. Filter out the current product from the list
  const relatedProducts = products
    .filter((p) => p._id.toString() !== id)
    .slice(0, 4); // Return top 4 related items

  return res
    .status(200)
    .json(new ApiResponse(200, relatedProducts, "Related products fetched successfully"));
});