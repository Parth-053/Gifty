import Category from "../../models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";
import { slugify } from "../../utils/slugify.js";

/**
 * @desc    Create Category
 * @route   POST /api/v1/admin/categories
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, parentId } = req.body;

  if (!name) throw new ApiError(httpStatus.BAD_REQUEST, "Category name is required");

  // Check if category already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(httpStatus.CONFLICT, "Category with this name already exists");
  }

  const category = await Category.create({
    name,
    slug: slugify(name),
    parentId: parentId || null // For sub-categories
  });

  return res.status(httpStatus.CREATED).json(
    new ApiResponse(httpStatus.CREATED, category, "Category created successfully")
  );
});

/**
 * @desc    Get All Categories (Tree Structure or Flat List)
 * @route   GET /api/v1/admin/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  // Return simple flat list with population of parent
  const categories = await Category.find()
    .populate("parentId", "name")
    .sort({ name: 1 });

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, categories, "Categories fetched successfully")
  );
});

/**
 * @desc    Update Category
 * @route   PATCH /api/v1/admin/categories/:id
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  const updates = {};
  if (name) {
    updates.name = name;
    updates.slug = slugify(name);
  }
  if (isActive !== undefined) {
    updates.isActive = isActive;
  }

  const category = await Category.findByIdAndUpdate(id, updates, { new: true });

  if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, category, "Category updated successfully")
  );
});

/**
 * @desc    Delete Category
 * @route   DELETE /api/v1/admin/categories/:id
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Optional: Prevent deleting if it has sub-categories
  const hasChildren = await Category.findOne({ parentId: id });
  if (hasChildren) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot delete category that has sub-categories");
  }

  await Category.findByIdAndDelete(id);
  
  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, {}, "Category deleted successfully")
  );
});