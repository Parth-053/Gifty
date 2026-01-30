import { Product } from "../../models/Product.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { httpStatus } from "../../constants/httpStatus.js";
import { sendEmail } from "../../services/email.service.js";

// --- Seller Approvals ---

export const getPendingSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({ status: "pending" })
    .select("-firebaseUid")
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, sellers, "Pending sellers fetched successfully"));
});

export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status");
  }

  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");

  seller.status = status;
  
  // FIX: Only activate the seller if status is 'approved'
  if (status === "approved") {
      seller.isActive = true; 
      seller.isVerified = true; 
  } else {
      seller.isActive = false;
      seller.isVerified = false;
      if (reason) seller.rejectionReason = reason;
  }

  await seller.save();

  // Email Notification
  try {
    const subject = status === "approved" ? "🎉 Account Approved" : "Account Status Update";
    const html = `<h1>Your Seller Account is ${status}</h1>`;
    await sendEmail({ to: seller.email, subject, html });
  } catch (error) {
    console.error("Email failed:", error);
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, seller, `Seller ${status} successfully`));
});

// --- Product Approvals (Keep Existing Logic) ---
export const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ verificationStatus: "pending" })
    .populate("sellerId", "storeName email")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, products, "Fetched"));
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

  product.verificationStatus = status;
  product.isActive = status === "approved";
  await product.save();

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, product, "Updated"));
});