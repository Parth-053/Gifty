import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  queryProducts, 
  getProductById 
} from "../../services/product.service.js";
import Seller from "../../models/seller.model.js"; // Needed to resolve ID
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.util.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";
import { slugify } from "../../utils/slugify.js";

// Helper: Get Seller ID from User ID
const getSellerId = async (userId) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new ApiError(httpStatus.FORBIDDEN, "Seller profile not found");
  return seller._id;
};

/**
 * @desc    Add Product
 * @route   POST /api/v1/sellers/products
 */
export const addProduct = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);
  
  const { 
    name, description, price, discountPrice, stock, categoryIds, tags, isCustomizable 
  } = req.body;

  // 1. Upload Images
  const imageFiles = req.files;
  if (!imageFiles || imageFiles.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "At least one product image is required");
  }

  const uploadPromises = imageFiles.map((file) => uploadOnCloudinary(file.path));
  const uploadResults = await Promise.all(uploadPromises);
  const validImages = uploadResults.filter(r => r).map(r => ({ url: r.url, publicId: r.publicId }));

  // 2. Prepare Data
  const productData = {
    sellerId,
    name,
    slug: slugify(name) + "-" + Date.now(),
    description,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : 0,
    stock: Number(stock),
    images: validImages,
    categoryIds: Array.isArray(categoryIds) ? categoryIds : [categoryIds],
    tags: tags ? tags.split(",").map(t => t.trim()) : [],
    isCustomizable: isCustomizable === "true" || isCustomizable === true
  };

  const product = await createProduct(productData);

  return res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, product, "Product added"));
});

/**
 * @desc    Get My Products
 * @route   GET /api/v1/sellers/products
 */
export const getMyProducts = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);

  const filters = { ...req.query, sellerId }; // Force filter by logged-in seller
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc"
  };

  const result = await queryProducts(filters, options);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, result, "Products fetched"));
});

/**
 * @desc    Update Product
 * @route   PATCH /api/v1/sellers/products/:productId
 */
export const updateProductDetails = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);
  const { productId } = req.params;
  const updates = req.body;

  // Handle Slug Update
  if (updates.name) updates.slug = slugify(updates.name) + "-" + Date.now();

  // Handle New Images (Append mode)
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
    const results = await Promise.all(uploadPromises);
    const newImages = results.filter(r => r).map(r => ({ url: r.url, publicId: r.publicId }));
    
    // Fetch existing to append
    const current = await getProductById(productId);
    updates.images = [...current.images, ...newImages];
  }

  const updatedProduct = await updateProduct(productId, updates, sellerId);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedProduct, "Product updated"));
});

/**
 * @desc    Remove Product (Soft Delete recommended)
 * @route   DELETE /api/v1/sellers/products/:productId
 */
export const removeProduct = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);
  
  // Logic inside service handles verification that seller owns this product
  await deleteProduct(req.params.productId, sellerId);

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, "Product deleted"));
});