import { Category } from "../../models/Category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as imageService from "../../services/image.service.js";  
import { httpStatus } from "../../constants/httpStatus.js";

export const getCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === 'true';
  }

  const categories = await Category.find(filter)
    .populate("parentId", "name")
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, categories, "Categories fetched"));
});

/**
 * @desc    Get Root Categories Only (No Parent)
 * @route   GET /api/v1/categories/root
 */
export const getRootCategories = asyncHandler(async (req, res) => {
  // Find categories where parentId is null or doesn't exist
  const rootCategories = await Category.find({
    $or: [{ parentId: null }, { parentId: { $exists: false } }],
    isActive: true 
  })
  // UPDATED: Added 'image' to selection so it can be displayed in UI
  .select("name _id image") 
  .sort({ name: 1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, rootCategories, "Root categories fetched"));
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new ApiError(httpStatus.BAD_REQUEST, "Category name is required");

  const existing = await Category.findOne({ name });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");

  let image = { url: "", publicId: "" };
  
  if (req.file) {
    try {
      const uploaded = await imageService.uploadImages([req.file], "categories");
      if (uploaded && uploaded.length > 0) image = uploaded[0];
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Image upload failed");
    }
  }

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

  const updateData = { ...req.body };

  if (req.file) {
    if (category.image?.publicId) {
        await imageService.deleteImages([{ publicId: category.image.publicId }]);
    }
    const uploaded = await imageService.uploadImages([req.file], "categories");
    if (uploaded && uploaded.length > 0) {
        updateData.image = uploaded[0];
    }
  } else {
    delete updateData.image; 
  }

  if (updateData.isActive !== undefined) {
    updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
  }

  const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
  );
  
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