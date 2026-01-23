import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as productService from "../../services/product.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Products (Public)
 * @route   GET /api/v1/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  // Calls the service which uses ApiFeatures (Filter, Sort, Paginate)
  const { products, total } = await productService.getAllProducts(req.query);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { products, total }, "Products fetched successfully"));
});

/**
 * @desc    Get Single Product
 * @route   GET /api/v1/products/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, "Product fetched successfully"));
});

/**
 * @desc    Get Related Products
 * @route   GET /api/v1/products/:id/related
 */
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  
  if (!product.categoryId) {
    return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, [], "No related products"));
  }

  // Reuse getAllProducts with category filter
  const query = {
    categoryId: product.categoryId._id || product.categoryId,
    limit: 5,
    page: 1,
    // Exclude current product
    _id: { ne: product._id } 
  };

  const { products } = await productService.getAllProducts(query);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, products, "Related products fetched"));
});