import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { uploadImages } from "./image.service.js";  

/**
 * Get All Products (Public/Shop View) 
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

  // 1. Build Filter Object for public view
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
    filter.name = { $regex: search, $options: "i" };
  }

  // 2. Build Sort Options
  let sortOptions = {};
  if (sort === "newest") sortOptions = { createdAt: -1 };
  else if (sort === "price_low") sortOptions = { price: 1 };
  else if (sort === "price_high") sortOptions = { price: -1 };

  // 3. Execute Query
  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("categoryId", "name slug");

  const total = await Product.countDocuments(filter);

  return { 
    products, 
    total, 
    page: Number(page), 
    pages: Math.ceil(total / limit) 
  };
};

/**
 * Create New Product (Seller Flow)
 */
export const createProduct = async (sellerId, productData, files) => {
  let images = [];
  if (files && files.length > 0) {
    images = await uploadImages(files, "products");
  }

  if (images.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  const product = await Product.create({
    ...productData,
    sellerId,
    images,
    isActive: true,
    verificationStatus: "pending"  
  });

  return product;
};

/**
 * Get Specific Product Details
 */
export const getProductById = async (id) => { 
  const product = await Product.findById(id)
    .populate("sellerId", "storeName rating")
    .populate("categoryId", "name slug");

  if (!product || product.isDeleted) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

/**
 * Update Product (Seller Edit Flow)
 */
export const updateProduct = async (sellerId, productId, updateData, files) => {
  const product = await Product.findOne({ _id: productId, sellerId });
  if (!product) throw new ApiError(404, "Product not found or unauthorized");

  if (files && files.length > 0) {
    const newImages = await uploadImages(files, "products");
    updateData.images = [...(updateData.existingImages || []), ...newImages];
  }

  Object.assign(product, updateData);
  product.verificationStatus = "pending"; 

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
  product.isActive = false;
  await product.save();
  return true;
};

/**
 * Get Seller Inventory
 */
export const getSellerInventory = async (sellerId, query) => {
  const { page = 1, limit = 10, search = "" } = query;
  const filter = { sellerId, isDeleted: false };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("categoryId", "name");

  const total = await Product.countDocuments(filter);
  return { products, total, page: Number(page), pages: Math.ceil(total / limit) };
};