import Order from "../../models/order.model.js";
import User from "../../models/user.model.js";
import Product from "../../models/product.model.js";
import Seller from "../../models/seller.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import { httpStatus, PaymentStatus, OrderStatus } from "../../utils/constants.js";

/**
 * @desc    Get Global Admin Stats (God Mode)
 * @route   GET /api/v1/admin/dashboard
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  // 1. Total Revenue (Only from Paid & Non-Cancelled Orders)
  const revenueAgg = await Order.aggregate([
    {
      $match: {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: { $ne: OrderStatus.CANCELLED }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" }
      }
    }
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // 2. Counts (Parallel Execution for Speed)
  const [totalUsers, totalSellers, totalProducts, totalOrders] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "seller" }), // Or Seller.countDocuments()
    Product.countDocuments(),
    Order.countDocuments()
  ]);

  // 3. Pending Approvals (Sellers waiting for verification)
  const pendingSellers = await Seller.countDocuments({ status: "pending" });

  // 4. Recent Orders (Global)
  const recentOrders = await Order.find()
    .select("totalAmount orderStatus createdAt paymentStatus")
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, {
      totalRevenue,
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      pendingSellers,
      recentOrders
    }, "Admin stats fetched successfully")
  );
});