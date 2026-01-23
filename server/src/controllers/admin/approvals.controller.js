import { Product } from "../../models/Product.model.js";
import { Seller } from "../../models/Seller.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpStatus } from "../../constants/httpStatus.js";

// --- Product Approvals ---

export const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ verificationStatus: "pending" })
    .populate("sellerId", "storeName email")
    .populate("categoryId", "name");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, products, "Pending products fetched"));
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body; // status: 'approved' | 'rejected'

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

  product.verificationStatus = status;
  // If we had a rejectionReason field in Product model, we'd save it here
  if (status === "rejected" && reason) {
    // Optionally send email logic here
  }

  await product.save();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, `Product ${status}`));
});

// --- Seller Approvals ---

export const getPendingSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({ status: "pending" });
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, sellers, "Pending sellers fetched"));
});

export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");

  seller.status = status;
  if (status === "rejected") {
    seller.rejectionReason = reason;
  }

  await seller.save();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, seller, `Seller ${status}`));
});