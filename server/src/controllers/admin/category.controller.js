import { Category } from "../../models/Category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as imageService from "../../services/image.service.js";  
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Categories
 * @route   GET /api/v1/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === 'true';
  }

  const categories = await Category.find(filter)
    .populate("parentId", "name")
    .sort({ createdAt: -1 }); // Sort by newest first

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, categories, "Categories fetched"));
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  if (!name) throw new ApiError(httpStatus.BAD_REQUEST, "Category name is required");

  const existing = await Category.findOne({ name });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");

  let image = { url: "", publicId: "" };
  
  // Handle Image Upload
  if (req.file) {
    try {
      const uploaded = await imageService.uploadImages([req.file], "categories");
      if (uploaded && uploaded.length > 0) image = uploaded[0];
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Image upload failed");
    }
  }

  // Handle boolean conversion for isActive (FormData sends strings 'true'/'false')
  const isActive = req.body.isActive === 'true' || req.body.isActive === true;

  const category = await Category.create({ 
    ...req.body, 
    isActive,
    image 
  });

  return res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, category, "Category created"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  if (req.file) {
    // Delete old image if it exists
    if (category.image?.publicId) {
        await imageService.deleteImages([{ publicId: category.image.publicId }]);
    }
    // Upload new image
    const uploaded = await imageService.uploadImages([req.file], "categories");
    if (uploaded && uploaded.length > 0) req.body.image = uploaded[0];
  }

  // Handle boolean conversion if present in body
  if (req.body.isActive !== undefined) {
    req.body.isActive = req.body.isActive === 'true' || req.body.isActive === true;
  }

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedCategory, "Category updated"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  
  if (category.image?.publicId) {
    await imageService.deleteImages([{ publicId: category.image.publicId }]);
  }
  
  await category.deleteOne();

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, "Category deleted"));
});