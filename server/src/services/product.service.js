import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js"; // Ensure you have status codes defined

/**
 * Create a new product
 * @param {Object} productData - validated data from controller
 * @returns {Promise<Object>} - Created product
 */
export const createProduct = async (productData) => {
  // Business Logic: Check if slug already exists (though handled by DB index, good to check)
  const existingProduct = await Product.findOne({ slug: productData.slug });
  if (existingProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product with this slug already exists");
  }

  const product = await Product.create(productData);
  return product;
};

/**
 * Update product details
 * @param {String} productId
 * @param {Object} updateData
 * @param {String} sellerId - To ensure only the owner can update
 * @returns {Promise<Object>}
 */
export const updateProduct = async (productId, updateData, sellerId) => {
  const product = await Product.findOne({ _id: productId, sellerId });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found or access denied");
  }

  // Update fields
  Object.assign(product, updateData);
  
  // Save ensures validations and virtuals run
  await product.save();
  return product;
};

/**
 * Get Product by ID (Public View)
 * Populates Category and Seller info nicely
 */
export const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("categoryIds", "name slug") // Only fetch name and slug of category
    .populate("sellerId", "storeName logo rating") // Only fetch public seller info
    .lean(); // 🔥 Faster read

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

/**
 * 🔥 ADVANCED FILTERING, SORTING & PAGINATION
 * This is the core engine for your browse/search page.
 * * @param {Object} filters - { minPrice, maxPrice, category, rating, search, sellerId }
 * @param {Object} options - { page, limit, sortBy, sortOrder }
 */
export const queryProducts = async (filters, options) => {
  const { 
    minPrice, 
    maxPrice, 
    category, // can be ID or slug
    rating, 
    search, 
    tags, 
    sellerId 
  } = filters;

  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;

  // 1. Build the Query Object
  const query = { visibility: "public" }; // Always show only public products

  // Search Logic (Regex for partial match on Name or Description)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } }, // 'i' case insensitive
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } }
    ];
  }

  // Category Filter
  if (category) {
    query.categoryIds = category; // Assuming Controller passes the Category ObjectId
  }

  // Seller Filter
  if (sellerId) {
    query.sellerId = sellerId;
  }

  // Price Range Filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Rating Filter (e.g. 4 stars and above)
  if (rating) {
    query.ratingAvg = { $gte: Number(rating) };
  }

  // Tags Filter
  if (tags) {
    const tagsArray = tags.split(",").map(t => t.trim().toLowerCase());
    query.tags = { $in: tagsArray };
  }

  // 2. Prepare Sort Object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;
  
  // Secondary sort by _id to ensure consistent pagination order
  sort["_id"] = 1; 

  // 3. Calculate Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // 4. Execute Queries in Parallel (Data + Count)
  // Using Promise.all is industry standard to reduce wait time
  const [products, totalCount] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select("-description -stock") // Optimization: Don't fetch heavy fields in list view
      .populate("categoryIds", "name")
      .lean(), // 🔥 Converts Mongoose Documents to Plain JS Objects (Much Faster)
    
    Product.countDocuments(query)
  ]);

  // 5. Return structured response with metadata
  return {
    products,
    meta: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit)),
      hasMore: skip + products.length < totalCount
    }
  };
};

/**
 * Delete a product (Soft delete or Hard delete based on requirement)
 * Here implemented as Hard Delete.
 */
export const deleteProduct = async (productId, sellerId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, sellerId },
    { visibility: "hidden" }, // Just hide it
    { new: true }
  );
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found or access denied");
  }
  
  return true;
};

// Internal utility to verify stock (used by Order Service)
export const checkStockAvailability = async (productId, quantity) => {
  const product = await Product.findById(productId).select("stock reservedStock");
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  
  // Using the virtual 'availableStock' logic manually here if needed for atomic checks
  const available = product.stock - product.reservedStock;
  
  if (available < quantity) {
    return { available: false, currentStock: available };
  }
  
  return { available: true, product };
};