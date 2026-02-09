import { asyncHandler } from "../../utils/asyncHandler.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import {ApiError} from "../../utils/ApiError.js";
import { Product } from "../../models/Product.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js";
import { httpStatus } from "../../constants/httpStatus.js";

// Helper to parse FormData fields
const parseProductData = (body) => {
  const data = { ...body };
  if (data.price) data.price = Number(data.price);
  if (data.stock) data.stock = Number(data.stock);
  if (data.discountPrice) data.discountPrice = Number(data.discountPrice);
  if (data.isCustomizable !== undefined) data.isCustomizable = data.isCustomizable === 'true';
  
  if (data.tags && !Array.isArray(data.tags)) data.tags = [data.tags];
  if (data.customizationOptions && !Array.isArray(data.customizationOptions)) data.customizationOptions = [data.customizationOptions];
  
  return data;
};

/**
 * @desc    Get Seller's Inventory (With Pagination)
 * @route   GET /api/v1/seller/products
 */
export const getMyInventory = asyncHandler(async (req, res) => {
  // --- CRITICAL FIX: Handle User/Seller ID safely ---
  const owner = req.user || req.seller;
  
  if (!owner || !owner._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication failed: User not identified.");
  }

  const sellerId = owner._id;
  // --------------------------------------------------

  const { page = 1, limit = 10, search, category, status } = req.query;

  const filter = { sellerId, isDeleted: false };

  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.categoryId = category;
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
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
 * @desc    Add New Product
 * @route   POST /api/v1/seller/products
 */
export const addProduct = asyncHandler(async (req, res) => {
  const owner = req.user || req.seller;
  if (!owner || !owner._id) throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  
  const sellerId = owner._id;
  const productData = parseProductData(req.body);
  const { name, categoryId } = productData;

  if (!name || !categoryId || !productData.price) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Name, Price, and Category are required");
  }

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
    sellerId,
    images
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, product, "Product created successfully"));
});

/**
 * @desc    Get Product Details (Edit View)
 * @route   GET /api/v1/seller/products/:id
 */
export const getProductDetails = asyncHandler(async (req, res) => {
  const owner = req.user || req.seller;
  
  const product = await Product.findOne({
    _id: req.params.id,
    sellerId: owner._id
  }).populate("categoryId", "name");
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, product, "Fetched"));
});

/**
 * @desc    Update Product
 * @route   PUT /api/v1/seller/products/:id
 */
export const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const owner = req.user || req.seller;
  const updates = parseProductData(req.body);

  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path, "products"));
    const newImages = await Promise.all(uploadPromises);
    const formatted = newImages.map(img => ({ url: img.secure_url, publicId: img.public_id }));
    
    const existing = await Product.findById(id);
    if(existing) updates.images = [...existing.images, ...formatted];
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, sellerId: owner._id }, 
    updates, 
    { new: true }
  );

  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, product, "Updated"));
});

/**
 * @desc    Delete Product
 * @route   DELETE /api/v1/seller/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const owner = req.user || req.seller;
  const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: owner._id });
  
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, "Deleted"));
});