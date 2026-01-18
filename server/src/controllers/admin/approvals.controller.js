import { Product } from "../../models/Product.model.js";
import { Seller } from "../../models/seller.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

// ==========================================
//  Product Approvals
// ==========================================

/**
 * @desc    Get Pending Products
 * @route   GET /api/v1/admin/approvals/products
 */
export const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ verificationStatus: "pending" })
    .populate("sellerId", "storeName email")
    .populate("categoryId", "name");
    
  return res.status(200).json(new ApiResponse(200, products, "Pending products fetched"));
});

/**
 * @desc    Approve/Reject Product
 * @route   POST /api/v1/admin/approvals/products/:id
 */
export const updateProductStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body; // status: 'approved' | 'rejected'
  
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  product.verificationStatus = status;
  if (status === "rejected") {
    // Maybe send email to seller here
    console.log(`Product rejected. Reason: ${reason}`);
  }

  await product.save();

  return res.status(200).json(new ApiResponse(200, product, `Product ${status} successfully`));
});

// ==========================================
// Seller Approvals
// ==========================================

/**
 * @desc    Get Pending Sellers
 * @route   GET /api/v1/admin/approvals/sellers
 */
export const getPendingSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({ status: "pending" })
    .populate("userId", "name email phone"); // Get owner details
    
  // Note: Sensitive data like GSTIN is selected: false by default in model.
  // Use .select('+gstin +panNumber') if admin needs to verify documents.
  
  return res.status(200).json(new ApiResponse(200, sellers, "Pending sellers fetched"));
});

/**
 * @desc    Approve/Reject Seller
 * @route   POST /api/v1/admin/approvals/sellers/:id
 */
export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body; // status: 'approved' | 'rejected'

  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(404, "Seller not found");

  seller.status = status;
  seller.rejectionReason = reason || "";

  await seller.save();

  return res.status(200).json(new ApiResponse(200, seller, `Seller ${status} successfully`));
});