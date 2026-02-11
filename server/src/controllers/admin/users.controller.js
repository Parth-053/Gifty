import { User } from "../../models/User.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { Product } from "../../models/Product.model.js";  
import * as imageService from "../../services/image.service.js";  
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { httpStatus } from "../../constants/httpStatus.js";

// --- User Management ---

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, users, "Users fetched"));
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user, "User details fetched"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'active' or 'blocked'
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: status === 'active' }, { new: true });
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user, "User status updated"));
});


// --- Seller Management ---

export const getAllSellers = asyncHandler(async (req, res) => {
  // Fetch all sellers who are NOT pending (Approved, Rejected, Suspended)
  const sellers = await Seller.find({})
    .select("-firebaseUid")
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, sellers, "Sellers fetched successfully"));
});

export const getSellerDetails = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");
  
  // Also get total products to display on the Seller Details page
  const totalProducts = await Product.countDocuments({ sellerId: seller._id });
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { ...seller.toObject(), totalProducts }, "Seller details fetched"));
});


/**
 * @desc    BAN / UNBAN SELLER (Admin Action)
 * @route   PATCH /api/v1/admin/sellers/:id/status
 */
export const updateSellerStatusAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // Expects "ban" or "unban"

  const seller = await Seller.findById(id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");

  if (action === "ban") {
    // 1. Suspend Seller Account
    seller.status = "suspended"; 
    seller.isActive = false;
    seller.isVerified = false;
    await seller.save();

    // 2. IMMEDIATELY Deactivate all products belonging to this seller
    await Product.updateMany(
      { sellerId: seller._id },
      { $set: { isActive: false, verificationStatus: "rejected" } }
    );
    
  } else if (action === "unban") {
    // 1. Un-suspend Seller Account
    seller.status = "approved";
    seller.isActive = true;
    seller.isVerified = true;
    await seller.save();

    await Product.updateMany(
      { sellerId: seller._id, isDeleted: false },
      { $set: { isActive: true, verificationStatus: "approved" } }
    );
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid action type. Use 'ban' or 'unban'.");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, seller, `Seller ${action === 'ban' ? 'banned' : 'unbanned'} successfully`)
  );
});


/**
 * @desc    HARD DELETE SELLER & ALL ASSOCIATED ASSETS (Admin Action)
 * @route   DELETE /api/v1/admin/sellers/:id
 */
export const deleteSellerAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const seller = await Seller.findById(id);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");
  }

  // 1. Find all products of the seller
  const products = await Product.find({ sellerId: seller._id });

  // 2. Delete ALL images for ALL products from Cloudinary
  for (const product of products) {
    if (product.images && product.images.length > 0) {
      try {
        await imageService.deleteImages(product.images);
      } catch (err) {
        console.error(`Failed to delete Cloudinary images for product ${product._id}`, err);
      }
    }
  }

  // 3. Delete all products from Database
  await Product.deleteMany({ sellerId: seller._id });

  // 4. Finally, Delete Seller from Database
  await seller.deleteOne();

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, null, "Seller and all associated products permanently deleted")
  );
});