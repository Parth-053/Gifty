import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import * as imageService from "./image.service.js";

// ... (createProduct, getAllProducts, getProductById, updateProduct remain same) ...

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
    verificationStatus: "pending"
  });

  return product;
};

export const getAllProducts = async (query) => {
  // Sellers/Public usually only see non-deleted items
  const features = new ApiFeatures(Product.find({ isDeleted: false }), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  
  const countFeatures = new ApiFeatures(Product.find({ isDeleted: false }), query).filter();
  const total = await countFeatures.query.countDocuments();

  return { products, total };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("sellerId", "storeName fullName");
  if (!product || product.isDeleted) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const updateProduct = async (sellerId, productId, updateData, files) => {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw new ApiError(404, "Product not found or unauthorized");

  if (files && files.length > 0) {
    const newImages = await imageService.uploadImages(files, "products");
    updateData.images = [...(product.images || []), ...newImages];
  }

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
    throw new ApiError(404, "Product not found or unauthorized");
  }

  // SOFT DELETE: Just mark the flag
  product.isDeleted = true;
  product.isActive = false;
  await product.save();

  return { message: "Product deleted successfully" };
};