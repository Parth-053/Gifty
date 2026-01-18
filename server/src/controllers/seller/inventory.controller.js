import { 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../../services/product.service.js";
import { Product } from "../../models/Product.model.js"; // Direct access for simple list
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

/**
 * @desc    Add New Product
 * @route   POST /api/v1/seller/inventory
 */
export const addProduct = asyncHandler(async (req, res) => {
  // req.files provided by multer middleware
  const product = await createProduct(req.user._id, req.body, req.files);
  return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

/**
 * @desc    Get Seller's Own Products
 * @route   GET /api/v1/seller/inventory
 */
export const getMyInventory = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    sellerId: req.user._id, 
    isDeleted: false 
  }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, products, "Inventory fetched"));
});

/**
 * @desc    Update Product
 * @route   PUT /api/v1/seller/inventory/:id
 */
export const editProduct = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.user._id, req.params.id, req.body, req.files);
  return res.status(200).json(new ApiResponse(200, product, "Product updated"));
});

/**
 * @desc    Delete Product
 * @route   DELETE /api/v1/seller/inventory/:id
 */
export const removeProduct = asyncHandler(async (req, res) => {
  await deleteProduct(req.user._id, req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, "Product deleted"));
});