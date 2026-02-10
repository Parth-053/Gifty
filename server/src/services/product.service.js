import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import * as imageService from "./image.service.js";
import { httpStatus } from "../constants/httpStatus.js";

/**
 * Create Product
 */
export const createProduct = async (productData, files, sellerId) => {
  if (files && files.length > 0) {
    const images = await imageService.uploadImages(files, "products");
    productData.images = images;
  }

  const product = await Product.create({
    ...productData,
    sellerId,
    verificationStatus: "pending",
    isActive: true
  });

  return product;
};

/**
 * Get All Products
 * @param {Object} query - Express query params
 * @param {Boolean} showDeleted - Whether to include soft-deleted items (Admin only)
 */
export const getAllProducts = async (query, showDeleted = false) => {
  // Base Query: If not Admin (showDeleted=false), hide deleted items
  const baseQuery = showDeleted ? {} : { isDeleted: false };
  
  const features = new ApiFeatures(Product.find(baseQuery), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Populate references for better UI data
  features.query = features.query
    .populate("sellerId", "storeName fullName email")
    .populate("categoryId", "name");

  const products = await features.query;
  
  const countFeatures = new ApiFeatures(Product.find(baseQuery), query).filter();
  const total = await countFeatures.query.countDocuments();

  return { products, total };
};

export const getProductById = async (id, showDeleted = false) => {
  const query = { _id: id };
  if (!showDeleted) query.isDeleted = false;

  const product = await Product.findOne(query)
    .populate("sellerId", "storeName fullName email phone")
    .populate("categoryId", "name");

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

export const updateProduct = async (sellerId, productId, updateData, files) => {
  const product = await Product.findOne({ _id: productId, sellerId, isDeleted: false });
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found or unauthorized");

  if (files && files.length > 0) {
    //  Delete old images if replacing? For now, we append/replace based on logic
    // const newImages = await imageService.uploadImages(files, "products");
    // updateData.images = [...product.images, ...newImages];
    
    // Logic: If new images uploaded, usually we might want to replace or add. 
    // Assuming replace or add based on business logic. Here we add:
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
 * Soft Delete Product (Seller Action)
 * Marks as deleted but keeps data and images for Admin review/restore
 */
export const deleteProduct = async (sellerId, productId) => {
  const product = await Product.findOne({ _id: productId, sellerId });
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found or unauthorized");
  }

  // SOFT DELETE
  product.isDeleted = true;
  product.isActive = false;  
  await product.save();

  return { message: "Product deleted successfully" };
};