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
  const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, banners, "Banners fetched"));
});

/**
 * @desc    Create Banner
 * @route   POST /api/v1/admin/banners
 */
export const createBanner = asyncHandler(async (req, res) => {
  // 1. Upload Image
  let image = null;
  if (req.file) {
    const uploaded = await imageService.uploadImages([req.file], "banners");
    image = uploaded[0];
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Banner image is required");
  }

  // 2. Create Record
  const banner = await Banner.create({
    ...req.body,
    image
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, banner, "Banner created successfully"));
});

/**
 * @desc    Delete Banner
 * @route   DELETE /api/v1/admin/banners/:id
 */
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");

  // Delete from Cloudinary
  if (banner.image?.publicId) {
    await imageService.deleteImages([{ publicId: banner.image.publicId }]);
  }

  await banner.deleteOne();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Banner deleted successfully"));
});