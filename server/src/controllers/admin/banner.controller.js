import { Banner } from "../../models/Banner.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as imageService from "../../services/image.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Banners
 * @route   GET /api/v1/admin/banners
 */
export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ position: 1, createdAt: -1 });
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, banners, "Banners fetched"));
});

/**
 * @desc    Get Single Banner
 * @route   GET /api/v1/admin/banners/:id
 */
export const getBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, banner, "Banner fetched successfully"));
});

/**
 * @desc    Create Banner
 * @route   POST /api/v1/admin/banners
 */
export const createBanner = asyncHandler(async (req, res) => {
  let image = null;
  if (req.file) {
    try {
      const uploaded = await imageService.uploadImages([req.file], "banners");
      if (uploaded && uploaded.length > 0) {
        image = uploaded[0];
      }
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Banner image upload failed");
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Banner image is required");
  }

  const banner = await Banner.create({
    ...req.body,
    image
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, banner, "Banner created successfully"));
});

/**
 * @desc    Update Banner
 * @route   PUT /api/v1/admin/banners/:id
 */
export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");

  // Handle Image Update
  if (req.file) {
    // 1. Delete old image
    if (banner.image?.publicId) {
      await imageService.deleteImages([{ publicId: banner.image.publicId }]);
    }
    // 2. Upload new image
    try {
      const uploaded = await imageService.uploadImages([req.file], "banners");
      if (uploaded && uploaded.length > 0) {
        req.body.image = uploaded[0];
      }
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Image update failed");
    }
  }

  const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedBanner, "Banner updated successfully"));
});

/**
 * @desc    Delete Banner
 * @route   DELETE /api/v1/admin/banners/:id
 */
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");

  if (banner.image?.publicId) {
    await imageService.deleteImages([{ publicId: banner.image.publicId }]);
  }

  await banner.deleteOne();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Banner deleted successfully"));
});