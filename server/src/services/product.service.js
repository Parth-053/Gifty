import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { uploadImages, deleteImages } from "./image.service.js";

/**
 * Create New Product (Seller)
 */
export const createProduct = async (sellerId, productData, files) => {
  // 1. Upload Images
  const images = await uploadImages(files, "products");

  if (images.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  // 2. Create Product
  const product = await Product.create({
    ...productData,
    sellerId,
    images,
    verificationStatus: "pending" // Admin approval needed
  });

  return product;
};

/**
 *  Get Products (Public - with Filters & Pagination)
 */
export const getAllProducts = async (query) => {
  const { 
    page = 1, 
    limit = 10, 
    sort = "newest", 
    category, 
    search, 
    minPrice, 
    maxPrice 
  } = query;

  // 1. Build Filter Object
  const filter = { 
    isActive: true, 
    verificationStatus: "approved", 
    isDeleted: false 
  };

  if (category) filter.categoryId = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$text = { $search: search };
  }

  // 2. Build Sort Object
  let sortOptions = {};
  if (sort === "newest") sortOptions = { createdAt: -1 };
  else if (sort === "price_low") sortOptions = { price: 1 };
  else if (sort === "price_high") sortOptions = { price: -1 };
  else if (sort === "rating") sortOptions = { "rating.average": -1 };

  // 3. Execute Query with Pagination
  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("categoryId", "name slug");

  const total = await Product.countDocuments(filter);

  return { products, total, page: Number(page), pages: Math.ceil(total / limit) };
};

/**
 * Get Single Product
 */
export const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate("sellerId", "storeName rating") // Show seller info
    .populate("categoryId", "name");
  
  if (!product || product.isDeleted) throw new ApiError(404, "Product not found");
  return product;
};

/**
 * Update Product (Seller)
 */
export const updateProduct = async (sellerId, productId, updateData, files) => {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw new ApiError(404, "Product not found or unauthorized");

  // Handle New Images
  if (files && files.length > 0) {
    const newImages = await uploadImages(files, "products");
    updateData.images = [...product.images, ...newImages]; // Append
  }

  Object.assign(product, updateData);

  await product.save();
  return product;
};

/**
 * Delete Product (Soft Delete)
 */
export const deleteProduct = async (sellerId, productId) => {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw new ApiError(404, "Product not found");

  product.isDeleted = true;
  await product.save();
};