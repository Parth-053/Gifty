import { Product } from "../../models/Product.model.js";
import { Seller } from "../../models/Seller.model.js";  
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";  
import { ApiError } from "../../utils/apiError.js";       
import { httpStatus } from "../../constants/httpStatus.js";
import { sendEmail } from "../../services/email.service.js"; // Ensure this service exists

// --- Product Approvals ---

/**
 * @desc    Get all products pending verification
 * @route   GET /api/v1/admin/approvals/products
 */
export const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ verificationStatus: "pending" })
    .populate("sellerId", "storeName email")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, products, "Pending products fetched successfully"));
});

/**
 * @desc    Approve or Reject a product
 * @route   PUT /api/v1/admin/approvals/products/:id
 */
export const updateProductStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body; // status: 'approved' | 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status. Use 'approved' or 'rejected'.");
  }

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

  product.verificationStatus = status;
  
  // If verifying, ensure isVerified is true so it shows in store
  if (status === "approved") {
      product.isVerified = true;
      product.isActive = true;
  } else if (status === "rejected") {
      product.isVerified = false;
      product.isActive = false;
      // Optionally verify logic for rejection reason storage if needed
  }

  await product.save();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, product, `Product ${status} successfully`));
});

// --- Seller Approvals ---

/**
 * @desc    Get all pending seller applications
 * @route   GET /api/v1/admin/approvals/sellers
 */
export const getPendingSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({ status: "pending" })
    .select("-firebaseUid") // Exclude sensitive ID
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, sellers, "Pending sellers fetched successfully"));
});

/**
 * @desc    Approve or Reject a seller
 * @route   PUT /api/v1/admin/approvals/sellers/:id
 */
export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status. Use 'approved' or 'rejected'.");
  }

  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");

  // Update Status
  seller.status = status;
  
  // Update verification flag
  if (status === "approved") {
      seller.isVerified = true; // Business verified
  } else if (status === "rejected") {
      seller.isVerified = false; 
      // Store rejection reason if your model has this field, otherwise just email it
      if (reason && seller.schema.path('rejectionReason')) {
          seller.rejectionReason = reason;
      }
  }

  await seller.save();

  // --- Send Notification Email ---
  try {
    const subject = status === "approved" 
        ? "🎉 Your Gifty Seller Account is Approved!" 
        : "Update regarding your Gifty Seller Application";
    
    const html = status === "approved" 
      ? `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #4F46E5;">Congratulations!</h1>
            <p>Your store <b>${seller.storeName}</b> has been approved.</p>
            <p>You can now log in to your dashboard and start selling.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5174'}/auth/login" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #EF4444;">Application Update</h1>
            <p>We regret to inform you that your application for <b>${seller.storeName}</b> was not approved.</p>
            <p><strong>Reason:</strong> ${reason || "Does not meet our current requirements."}</p>
        </div>
      `;

    await sendEmail({ to: seller.email, subject, html });
  } catch (emailError) {
      console.error("Failed to send status email:", emailError);
      // Don't fail the request just because email failed
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, seller, `Seller ${status} successfully`));
});