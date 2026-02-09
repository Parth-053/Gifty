import { asyncHandler } from "../../utils/asyncHandler.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import {ApiError} from "../../utils/ApiError.js";
import { Product } from "../../models/Product.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js";
import { httpStatus } from "../../constants/httpStatus.js";

// Helper to parse FormData fields correctly
const parseProductData = (body) => {
  const data = { ...body };
  
  // Convert numeric strings
  if (data.price) data.price = Number(data.price);
  if (data.stock) data.stock = Number(data.stock);
  if (data.discountPrice) data.discountPrice = Number(data.discountPrice);
  
  // Convert "true"/"false" strings to booleans
  if (data.isCustomizable !== undefined) {
    data.isCustomizable = data.isCustomizable === 'true';
  }

  // Handle Arrays (Multer might treat single items as strings)
  if (data.tags && !Array.isArray(data.tags)) {
    data.tags = [data.tags];
  }
  if (data.customizationOptions && !Array.isArray(data.customizationOptions)) {
    data.customizationOptions = [data.customizationOptions];
  }
  
  return data;
};

/**
 * @desc    Add New Product
 * @route   POST /api/v1/seller/products
 */
export const addProduct = asyncHandler(async (req, res) => {
  // FIX: Use req.user._id instead of req.seller._id
  const sellerId = req.user._id; 
  
  const productData = parseProductData(req.body);
  const { name, categoryId } = productData;

  if (!name || !categoryId || !productData.price) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Name, Price, and Category are required");
  }

  // Handle Image Uploads
  const imageFiles = req.files || [];
  if (imageFiles.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "At least one product image is required");
  }

  const uploadPromises = imageFiles.map(file => uploadOnCloudinary(file.path, "products"));
  const uploadedImages = await Promise.all(uploadPromises);
  
  const images = uploadedImages.map(img => ({
    url: img.secure_url,
    publicId: img.public_id
  }));

  const product = await Product.create({
    ...productData,
    sellerId, // This links the product to the User/Seller ID
    images
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, product, "Product created successfully"));
});

/**
 * @desc    Get Seller's Inventory
 * @route   GET /api/v1/seller/products
 */
export const getMyInventory = asyncHandler(async (req, res) => {
  // FIX: Use req.user._id (This was causing the 500 error)
  const sellerId = req.user._id;
  const { page = 1, limit = 10, search, category, status } = req.query;

  const filter = { sellerId, isDeleted: false };

  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.categoryId = category;
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(filter)
    .populate("categoryId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments(filter);

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, {
      products,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    }, "Inventory fetched successfully")
  );
});

/**
 * @desc    Get Product Details
 * @route   GET /api/v1/seller/products/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    sellerId: req.user._id
  }).populate("categoryId", "name");
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
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
  const { id } = req.params;
  const sellerId = req.user._id;
  
  const existingProduct = await Product.findOne({ _id: id, sellerId });
  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found or unauthorized");
  }

  const updates = parseProductData(req.body);

  // Handle New Images (Append)
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path, "products"));
    const newImages = await Promise.all(uploadPromises);
    const formattedImages = newImages.map(img => ({ url: img.secure_url, publicId: img.public_id }));
    
    updates.images = [...existingProduct.images, ...formattedImages];
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedProduct, "Product updated successfully"));
});

/**
 * @desc    Delete Product
 * @route   DELETE /api/v1/seller/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ 
    _id: req.params.id, 
    sellerId: req.user._id 
  });

  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Product deleted successfully"));
});