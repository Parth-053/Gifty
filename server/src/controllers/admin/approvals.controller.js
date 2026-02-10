import { Product } from "../../models/Product.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpStatus } from "../../constants/httpStatus.js";
import { notifySeller } from "../../services/notification.service.js"; 

// --- Seller Approvals ---

export const getPendingSellers = asyncHandler(async (req, res) => {
  // Fetch sellers with 'pending' status (Ensure your Seller model uses 'status' enum or field)
  const sellers = await Seller.find({ status: "pending" })
    .select("-password -firebaseUid") // Exclude sensitive data
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
  
  // Sync verified/active flags based on approval
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
    console.error("Notification failed:", err.message);
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, seller, `Seller ${status} successfully`)
  );
});

// --- Product Approvals ---

export const getPendingProducts = asyncHandler(async (req, res) => {
  // FIX: Filter out deleted products so Admin doesn't see items the seller already removed
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

  const product = await Product.findById(id).populate("sellerId", "storeName email");
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Guard: Don't verify deleted products
  if (product.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot update status of a deleted product");
  }

  // Update Status
  product.verificationStatus = status;
  
  // Logic: Only active if approved
  product.isActive = status === "approved"; 
  
  if (reason) product.rejectionReason = reason;
  
  await product.save();

 // Notify Seller logic 
  const recipientId = product.sellerId?._id || product.sellerId;

  if (recipientId) {
      try {
        await notifySeller(recipientId, {
          type: "PRODUCT_STATUS",
          title: `Product ${status === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your product "${product.name}" has been ${status}. ${reason ? `Reason: ${reason}` : ''}`,
          data: { productId: product._id }
        });
      } catch (err) {
         console.error("Notification failed:", err.message);
      }
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, product, `Product ${status} successfully`)
  );
});