import { Banner } from "../../models/Banner.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, banners, "Banners fetched"));
});

export const createBanner = asyncHandler(async (req, res) => {
  // TODO: Integrate Cloudinary Image Upload
  const banner = await Banner.create(req.body);
  res.status(201).json(new ApiResponse(201, banner, "Banner created"));
});

export const deleteBanner = asyncHandler(async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Banner deleted"));
});