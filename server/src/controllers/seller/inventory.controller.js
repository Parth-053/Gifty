import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as productService from "../../services/product.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Add New Product
 * @route   POST /api/v1/seller/inventory
 */
export const addProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.body, 
    req.files, 
    req.seller._id // Passed from auth middleware
  );

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, product, "Product created successfully"));
});

/**
 * @desc    Get Seller's Inventory
 * @route   GET /api/v1/seller/inventory
 */
export const getMyInventory = asyncHandler(async (req, res) => {
  // Force sellerId filter into the query
  req.query.sellerId = req.seller._id;
  
  const { products, total } = await productService.getAllProducts(req.query);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { products, total }, "Inventory fetched successfully"));
});

/**
 * @desc    Get Product Details (Edit View)
 * @route   GET /api/v1/seller/inventory/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  
  // Security Check: Ensure product belongs to this seller
  if (product.sellerId._id.toString() !== req.seller._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to view this product");
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, "Product details fetched"));
});

/**
 * @desc    Update Product
 * @route   PUT /api/v1/seller/inventory/:id
 */
export const editProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.seller._id, 
    req.params.id, 
    req.body, 
    req.files
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, "Product updated successfully"));
});

/**
 * @desc    Delete Product
 * @route   DELETE /api/v1/seller/inventory/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.seller._id, req.params.id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Product deleted successfully"));
});