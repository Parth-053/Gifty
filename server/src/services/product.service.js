import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import * as imageService from "./image.service.js";

/**
 * Create Product
 */
export const createProduct = async (productData, files, sellerId) => {
  // 1. Upload Images
  if (files && files.length > 0) {
    const images = await imageService.uploadImages(files, "products");
    productData.images = images;
  }

  // 2. Create Product
  const product = await Product.create({
    ...productData,
    sellerId,
    verificationStatus: "pending" // Always pending initially
  });

  return product;
};

/**
 * Get All Products (Advanced Filter/Sort/Page)
 */
export const getAllProducts = async (query) => {
  // Initialize ApiFeatures with the Mongoose Query
  const features = new ApiFeatures(Product.find({ isActive: true, isDeleted: false }), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute Query
  const products = await features.query;
  
  // Get total count for frontend pagination
  const countFeatures = new ApiFeatures(Product.find({ isActive: true, isDeleted: false }), query)
    .filter();
  const total = await countFeatures.query.countDocuments();

  return { products, total };
};

/**
 * Get Single Product
 */
export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("sellerId", "storeName fullName");
  if (!product || product.isDeleted) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

/**
 * Update Product
 */
export const updateProduct = async (sellerId, productId, updateData, files) => {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw new ApiError(404, "Product not found or unauthorized");

  // Handle Image Updates
  if (files && files.length > 0) {
    const newImages = await imageService.uploadImages(files, "products");
    updateData.images = [...(product.images || []), ...newImages];
  }

  // If critical fields change, reset verification
  if (updateData.name || updateData.description || updateData.price) {
    updateData.verificationStatus = "pending";
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
  return updatedProduct;
};

/**
 * Soft Delete Product
 */
export const deleteProduct = async (sellerId, productId) => {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw new ApiError(404, "Product not found");

  product.isDeleted = true;
  product.isActive = false;
  await product.save();
  return true;
};