import { Category } from "../../models/Category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as imageService from "../../services/image.service.js"; 
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Categories
 * @route   GET /api/v1/admin/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .populate("parentId", "name")
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, categories, "Categories fetched"));
});

/**
 * @desc    Create Category
 * @route   POST /api/v1/admin/categories
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");

  let image = { url: "", publicId: "" };
  
  // 1. Upload Image to Cloudinary
  if (req.file) {
    try {
      const uploaded = await imageService.uploadImages([req.file], "categories");
      // uploadImages returns an array, pick the first one
      if (uploaded && uploaded.length > 0) {
        image = uploaded[0];
      }
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Image upload failed");
    }
  }

  // 2. Create Category in DB
  const category = await Category.create({
    ...req.body, // This includes name, description, parentId, and isActive
    image // This overrides any 'image' field if it happened to be in body
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, category, "Category created"));
});

/**
 * @desc    Update Category
 * @route   PUT /api/v1/admin/categories/:id
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  // Handle Image Update
  if (req.file) {
    // A. Delete old image from Cloudinary
    if (category.image?.publicId) {
      await imageService.deleteImages([{ publicId: category.image.publicId }]);
    }
    
    // B. Upload new image
    const uploaded = await imageService.uploadImages([req.file], "categories");
    if (uploaded && uploaded.length > 0) {
      req.body.image = uploaded[0];
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedCategory, "Category updated"));
});

/**
 * @desc    Delete Category
 * @route   DELETE /api/v1/admin/categories/:id
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  if (category.image?.publicId) {
    await imageService.deleteImages([{ publicId: category.image.publicId }]);
  }

  await category.deleteOne();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Category deleted"));
});