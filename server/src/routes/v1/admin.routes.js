import { Router } from "express";
import { 
  getDashboardStats, 
  getSalesGraph 
} from "../../controllers/admin/analytics.controller.js";
import { 
  getPendingSellers, 
  updateSellerStatus, 
  getPendingProducts, 
  updateProductStatus 
} from "../../controllers/admin/approvals.controller.js";
import { 
  getAllUsers, 
  getUserDetails, 
  updateUserStatus,
  getAllSellers,    // <--- Import this
  getSellerDetails  // <--- Import this
} from "../../controllers/admin/users.controller.js";
import { 
  getAllOrders, 
  updateAdminOrderStatus 
} from "../../controllers/admin/order.controller.js";
import { 
  getAllTransactions,
  getAllPayouts 
} from "../../controllers/admin/finance.controller.js";
import {
  getCoupons,
  createCoupon,
  deleteCoupon
} from "../../controllers/admin/coupon.controller.js";
import {
  getSettings,
  updateSettings
} from "../../controllers/admin/settings.controller.js";
import { 
  getAllReturnRequests, 
  updateReturnStatus 
} from "../../controllers/admin/return.controller.js";

import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createCouponSchema } from "../../validations/coupon.schema.js";

const router = Router();

// Protect all routes
router.use(verifyAuth, authorizeRoles("admin"));

// --- Analytics ---
router.get("/analytics/dashboard", getDashboardStats);
router.get("/analytics/graph", getSalesGraph);

// --- Approvals ---
router.get("/approvals/sellers", getPendingSellers);
router.put("/approvals/sellers/:id", updateSellerStatus);

router.get("/approvals/products", getPendingProducts);
router.put("/approvals/products/:id", updateProductStatus);

// --- Users & Sellers Management ---
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);
router.patch("/users/:id/status", updateUserStatus);

// NEW ROUTES FOR SELLERS LIST
router.get("/sellers", getAllSellers);
router.get("/sellers/:id", getSellerDetails);

// --- Order Management ---
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateAdminOrderStatus);

// --- Finance ---
router.get("/finance/transactions", getAllTransactions);
router.get("/finance/payouts", getAllPayouts);

// --- Returns ---
router.get("/returns", getAllReturnRequests);
router.patch("/returns/:id/status", updateReturnStatus);

// --- Coupons ---
router.route("/coupons")
  .get(getCoupons)
  .post(validate(createCouponSchema), createCoupon);

router.delete("/coupons/:id", deleteCoupon);

// --- Settings ---
router.route("/settings")
  .get(getSettings)
  .put(updateSettings);

export default router;