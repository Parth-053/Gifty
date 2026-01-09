import { 
  registerSeller, 
  getSellerProfile, 
  updateSellerProfile 
} from "../../services/seller.service.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";

/**
 * @desc    Onboard as a Seller (User -> Seller)
 * @route   POST /api/v1/sellers/onboard
 */
export const registerNewSeller = asyncHandler(async (req, res) => {
  const { storeName, description, phone } = req.body;

  // Image Upload Handling (Logo & Banner)
  let logo = null;
  let bannerImage = null;

  if (req.files) {
    if (req.files.logo?.[0]) {
      const img = await uploadOnCloudinary(req.files.logo[0].path);
      if (img) logo = { url: img.url, publicId: img.publicId };
    }
    if (req.files.banner?.[0]) {
      const img = await uploadOnCloudinary(req.files.banner[0].path);
      if (img) bannerImage = { url: img.url, publicId: img.publicId };
    }
  }

  const sellerData = {
    storeName,
    ownerName: req.user.name,
    email: req.user.email, // Display email
    phone,
    description,
    logo,
    bannerImage
  };

  // Pass req.user._id to link User -> Seller
  const seller = await registerSeller(req.user._id, sellerData);

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, seller, "Seller account created successfully"));
});

/**
 * @desc    Get My Seller Profile
 * @route   GET /api/v1/sellers/profile
 */
export const getMySellerProfile = asyncHandler(async (req, res) => {
  // We find profile by the logged-in User's email/ID logic handled in service
  // Or directly call Service with email
  const seller = await getSellerProfile(req.user.email);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, seller, "Profile fetched"));
});

/**
 * @desc    Update Store Details
 * @route   PATCH /api/v1/sellers/profile
 */
export const updateStoreDetails = asyncHandler(async (req, res) => {
  // 1. Resolve Seller ID
  const currentSeller = await getSellerProfile(req.user.email);
  
  const updates = req.body;
  
  // 2. Handle Image Updates
  if (req.files) {
    if (req.files.logo?.[0]) {
      const img = await uploadOnCloudinary(req.files.logo[0].path);
      updates.logo = { url: img.url, publicId: img.publicId };
    }
    if (req.files.banner?.[0]) {
      const img = await uploadOnCloudinary(req.files.banner[0].path);
      updates.bannerImage = { url: img.url, publicId: img.publicId };
    }
  }

  const updatedSeller = await updateSellerProfile(currentSeller._id, updates);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedSeller, "Store updated successfully"));
});