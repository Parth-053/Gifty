import { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductById 
} from "../../services/product.service.js";
import { Product } from "../../models/Product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Add New Product (Multiple Images Support)
 * @route   POST /api/v1/seller/inventory
 */
export const addProduct = asyncHandler(async (req, res) => {
  // Sync with AddProduct.jsx: Ensure images are present
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  const product = await createProduct(req.user._id, req.body, req.files);
  return res.status(201).json(
    new ApiResponse(201, product, "Product published successfully")
  );
});

/**
 * @desc    Get Seller's Own Products (With Search & Pagination)
 * @route   GET /api/v1/seller/inventory
 */
export const getMyInventory = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  
  // Sync with ProductList.jsx: Support dynamic searching
  const query = { 
    sellerId: req.user._id, 
    isDeleted: false 
  };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, { 
      products, 
      pagination: { total, page, totalPages: Math.ceil(total / limit) } 
    }, "Inventory fetched")
  );
});

/**
 * @desc    Get Specific Product Details
 * @route   GET /api/v1/seller/inventory/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  // Sync with ProductDetails.jsx: Fetch individual item data
  const product = await Product.findOne({ 
    _id: req.params.id, 
    sellerId: req.user._id 
  });

  if (!product) {
    throw new ApiError(404, "Product not found or unauthorized");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product details fetched")
  );
});

/**
 * @desc    Update Product Details & Media
 * @route   PUT /api/v1/seller/inventory/:id
 */
export const editProduct = asyncHandler(async (req, res) => {
  // Sync with EditProduct.jsx: Update fields and handle new images
  const product = await updateProduct(req.user._id, req.params.id, req.body, req.files);
  return res.status(200).json(
    new ApiResponse(200, product, "Product updated successfully")
  );
});

/**
 * @desc    Soft Delete Product
 * @route   DELETE /api/v1/seller/inventory/:id
 */
export const removeProduct = asyncHandler(async (req, res) => {
  // Logic to prevent hard delete if orders exist (Industry Standard)
  await deleteProduct(req.user._id, req.params.id);
  return res.status(200).json(
    new ApiResponse(200, {}, "Product moved to trash")
  );
});