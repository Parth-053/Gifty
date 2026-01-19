import Category from "../../models/Category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js"; 


// 1. Get All Categories (Public) - Supports Hierarchy
export const getCategories = asyncHandler(async (req, res) => {
  // Fetch categories sorted by newest
  const categories = await Category.find()
    .populate('parentId', 'name') // Show parent name
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, categories, "Categories fetched successfully")
  );
});

// 2. Create Category (Admin Only) - With Image Upload
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentId, isActive } = req.body;

  // 1. Check if category already exists
  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(400, "Category with this name already exists");
  }

  // 2. Handle Image Upload (If file is present)
  let image = { url: "", publicId: "" };
  
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult) {
      image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }
  }

  // 3. Create Category
  const category = await Category.create({
    name,
    description,
    parentId: parentId || null,  
    isActive: isActive === 'true' || isActive === true,
    image: image
  });

  return res.status(201).json(
    new ApiResponse(201, category, "Category created successfully")
  );
});

// 3. Update Category (Admin Only) - With Image Update
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, parentId, isActive } = req.body;

  // 1. Find Category
  let category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // 2. Handle Image Update (If new file is uploaded)
  let image = category.image; // Keep old image by default

  if (req.file) {
    // Optional: Delete old image from Cloudinary here if needed
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult) {
      image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }
  }

  // 3. Update Fields
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      name: name || category.name,
      description: description || category.description,
      parentId: parentId || category.parentId,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : category.isActive,
      image: image
    },
    { new: true } // Return updated document
  );

  return res.status(200).json(
    new ApiResponse(200, updatedCategory, "Category updated successfully")
  );
});

// 4. Delete Category 
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await Category.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Category deleted successfully")
  );
});