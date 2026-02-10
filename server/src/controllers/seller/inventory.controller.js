import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as productService from "../../services/product.service.js"; 
import { notifyAdmin } from "../../services/notification.service.js";
import { httpStatus } from "../../constants/httpStatus.js";
import { createProductSchema, updateProductSchema } from "../../validations/product.schema.js";

// Helper to parse FormData and Validate
const parseAndValidate = (body, schema) => {
  const data = { ...body };
  
  // Convert numeric strings to numbers
  if (data.price) data.price = Number(data.price);
  if (data.stock) data.stock = Number(data.stock);
  // Handle discountPrice: if empty string or null, set to null, else Number
  if (data.discountPrice) {
      data.discountPrice = Number(data.discountPrice);
  } else {
      data.discountPrice = null;
  }
  
  // Convert booleans
  if (data.isCustomizable !== undefined) data.isCustomizable = data.isCustomizable === 'true';
  
  // Joi Validation
  const { error, value } = schema.validate(data, { stripUnknown: true });
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);
  }
  return value;
};

/**
 * @desc    Add New Product
 * @route   POST /api/v1/seller/products
 */
export const addProduct = asyncHandler(async (req, res) => {
  // Robust check for owner (handles req.user or req.seller)
  const ownerId = req.user?._id || req.seller?._id;
  if (!ownerId) throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");

  // Parse and Validate Data
  const productData = parseAndValidate(req.body, createProductSchema);
  const imageFiles = req.files || [];

  if (imageFiles.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "At least one product image is required");
  }

  const product = await productService.createProduct(
    productData, 
    imageFiles, 
    ownerId
  );

  // Notify Admin (Non-blocking)
  try {
    await notifyAdmin({
      type: "INVENTORY",
      title: "New Product Added",
      message: `Seller has added a new product: ${product.name}`,
      data: { productId: product._id, sellerId: ownerId, productName: product.name }
    });
  } catch (err) {
    console.error("Notification Error:", err.message); 
  }

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, product, "Product created successfully"));
});

/**
 * @desc    Get Seller's Inventory
 * @route   GET /api/v1/seller/products
 */
export const getMyInventory = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id || req.seller?._id;
  if (!ownerId) throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");

  // Force sellerId filter
  req.query.sellerId = ownerId;
  
  // FIX: Pass 'false' to hide deleted items from Seller view
  const { products, total } = await productService.getAllProducts(req.query, false);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { products, total }, "Inventory fetched successfully"));
});

/**
 * @desc    Get Product Details
 * @route   GET /api/v1/seller/products/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id || req.seller?._id;
  
  // FIX: Pass 'false' so sellers can't view deleted items via ID
  const product = await productService.getProductById(req.params.id, false);
  
  // Security Check
  if (product.sellerId?._id?.toString() !== ownerId.toString() && product.sellerId?.toString() !== ownerId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to view this product");
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, "Product details fetched"));
});

/**
 * @desc    Update Product
 * @route   PUT /api/v1/seller/products/:id
 */
export const editProduct = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id || req.seller?._id;
  
  // Parse and Validate Updates
  const updates = parseAndValidate(req.body, updateProductSchema);

  const product = await productService.updateProduct(
    ownerId, 
    req.params.id, 
    updates, 
    req.files
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, "Product updated successfully"));
});

/**
 * @desc    Delete Product (Soft Delete)
 * @route   DELETE /api/v1/seller/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id || req.seller?._id;
  
  // Service handles Soft Delete logic
  await productService.deleteProduct(ownerId, req.params.id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Product deleted successfully"));
});