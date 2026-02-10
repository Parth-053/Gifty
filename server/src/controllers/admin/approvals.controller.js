import { Product } from "../../models/Product.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpStatus } from "../../constants/httpStatus.js";
// --- FIX: Import the notification service ---
import { notifySeller } from "../../services/notification.service.js"; 

// --- Seller Approvals ---

export const getPendingSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({ status: "pending" })
    .select("-firebaseUid")
    .sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, sellers, "Pending sellers fetched")
  );
});

export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status");
  }

  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");

  seller.status = status;
  
  if (status === "approved") {
      seller.isActive = true; 
      seller.isVerified = true; 
  } else {
      seller.isActive = false;
      seller.isVerified = false;
  }

  await seller.save();

  // Notify Seller
  try {
    await notifySeller(seller._id, {
      type: "ACCOUNT_STATUS",
      title: `Account ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: reason || `Your seller account has been ${status}.`
    });
  } catch (err) {
    console.error("Notification failed:", err);
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, seller, `Seller ${status}`)
  );
});

// --- Product Approvals ---

export const getPendingProducts = asyncHandler(async (req, res) => {
  // FIX: Filter out deleted products so Admin doesn't see them
  const products = await Product.find({ 
    verificationStatus: "pending",
    isDeleted: false 
  })
    .populate("sellerId", "storeName fullName email")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, products, "Pending products fetched")
  );
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body; 

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status");
  }

  const product = await Product.findById(id).populate("sellerId");
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  product.verificationStatus = status;
  product.isActive = status === "approved"; 
  if (reason) product.rejectionReason = reason;
  
  await product.save();

  // Notify Seller
  if (product.sellerId?._id) {
     try {
       await notifySeller(product.sellerId._id, {
         type: "PRODUCT_STATUS",
         title: `Product ${status === 'approved' ? 'Approved' : 'Rejected'}`,
         message: `Your product "${product.name}" has been ${status}. ${reason ? `Reason: ${reason}` : ''}`,
         data: { productId: product._id }
       });
     } catch (err) {
        console.error("Notification failed:", err);
     }
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, product, `Product ${status}`)
  );
});