import { 
  getAllProducts, 
  getProductById 
} from "../../services/product.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Get All Products (Public View)
 * @route   GET /api/v1/products
 */
export const getProducts = asyncHandler(async (req, res) => {
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
 * @desc    Get Related Products
 * @route   GET /api/v1/products/:id/related
 */
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentProduct = await getProductById(id);

  if (!currentProduct.categoryId) {
    return res.status(200).json(new ApiResponse(200, [], "No related products found"));
  }

  const { products } = await getAllProducts({ 
    category: currentProduct.categoryId._id || currentProduct.categoryId,
    limit: 5,
    page: 1
  });

  const relatedProducts = products.filter((p) => p._id.toString() !== id);
  return res
    .status(200)
    .json(new ApiResponse(200, relatedProducts, "Related products fetched"));
});