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

import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createCouponSchema } from "../../validations/coupon.schema.js";
import { updateStatusSchema } from "../../validations/admin.schema.js";

const router = Router();

// Protect all routes: Admin Only
router.use(verifyAuth, authorizeRoles("admin"));

// --- Analytics ---
router.get("/analytics/dashboard", getDashboardStats);
router.get("/analytics/graph", getSalesGraph);

// --- Approvals ---
router.get("/approvals/sellers", getPendingSellers);
router.patch("/approvals/sellers/:id", validate(updateStatusSchema), updateSellerStatus);

router.get("/approvals/products", getPendingProducts);
router.patch("/approvals/products/:id", validate(updateStatusSchema), updateProductStatus);

// --- Users Management ---
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);
router.patch("/users/:id/status", updateUserStatus);

// --- Order Management ---
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", validate(updateStatusSchema), updateAdminOrderStatus);

// --- Finance ---
router.get("/finance/transactions", getAllTransactions);
router.get("/finance/payouts", getAllPayouts);

// --- Coupons ---
router.route("/coupons")
  .get(getCoupons)
  .post(validate(createCouponSchema), createCoupon);

router.delete("/coupons/:id", deleteCoupon);

// --- System Settings ---
router.route("/settings")
  .get(getSettings)
  .put(updateSettings);

export default router;