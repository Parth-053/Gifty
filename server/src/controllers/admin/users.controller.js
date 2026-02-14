import { User } from "../../models/User.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { Product } from "../../models/Product.model.js";
import { Address } from "../../models/Address.model.js"; 
import * as imageService from "../../services/image.service.js";  
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpStatus } from "../../constants/httpStatus.js";

// --- User Management ---

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
 
  let query = { role: "user" };
  
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { users, total }, "Users fetched successfully")
  );
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Fetch User
  const user = await User.findById(id).select("-password");
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  // 2. Explicitly Fetch Addresses using 'ownerId' (Matches your Model)
  const addresses = await Address.find({ ownerId: id });

  // 3. Merge them
  const userData = { 
    ...user.toObject(), 
    addresses: addresses || [] 
  };

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, userData, "User details fetched")
  );
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive, status } = req.body; 
  const { id } = req.params;
  
  let newStatus;
  if (isActive !== undefined) {
      newStatus = isActive; 
  } else {
      newStatus = status === 'active'; 
  }

  // 1. Update User
  const user = await User.findByIdAndUpdate(
    id, 
    { isActive: newStatus }, 
    { new: true }
  ).select("-password");

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  // 2. Re-fetch addresses using 'ownerId' so they don't disappear
  const addresses = await Address.find({ ownerId: id });

  // 3. Return merged data
  const userData = { 
    ...user.toObject(), 
    addresses: addresses || [] 
  };

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, userData, "User status updated")
  );
});

// --- Seller Management --- (Kept as is)
export const getAllSellers = asyncHandler(async (req, res) => {
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
  
  const totalProducts = await Product.countDocuments({ sellerId: seller._id });
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { ...seller.toObject(), totalProducts }, "Seller details fetched"));
});

export const updateSellerStatusAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; 

  const seller = await Seller.findById(id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");

  if (action === "ban") {
    seller.status = "suspended"; 
    seller.isActive = false;
    seller.isVerified = false;
    await seller.save();

    await Product.updateMany(
      { sellerId: seller._id },
      { $set: { isActive: false, verificationStatus: "rejected" } }
    );
    
  } else if (action === "unban") {
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

export const deleteSellerAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const seller = await Seller.findById(id);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");
  }

  const products = await Product.find({ sellerId: seller._id });

  for (const product of products) {
    if (product.images && product.images.length > 0) {
      try {
        await imageService.deleteImages(product.images);
      } catch (err) {
        console.error(`Failed to delete Cloudinary images for product ${product._id}`, err);
      }
    }
  }

  await Product.deleteMany({ sellerId: seller._id });
  await seller.deleteOne();

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, null, "Seller and all associated products permanently deleted")
  );
});