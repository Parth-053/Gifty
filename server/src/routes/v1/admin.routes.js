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
  deleteUser 
} from "../../controllers/admin/users.controller.js";
import { 
  getAllOrders, 
  updateAdminOrderStatus 
} from "../../controllers/admin/order.controller.js";

import { 
  getAllTransactions,
  getAllPayouts 
} from "../../controllers/admin/finance.controller.js";

import { verifyJWT, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes
router.use(verifyJWT, authorizeRoles("admin"));

// Analytics
router.get("/analytics/dashboard", getDashboardStats);
router.get("/analytics/graph", getSalesGraph);

// Approvals
router.get("/approvals/sellers", getPendingSellers);
router.post("/approvals/sellers/:id", updateSellerStatus);
router.get("/approvals/products", getPendingProducts);
router.post("/approvals/products/:id", updateProductStatus);

// Users
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserDetails).delete(deleteUser);
router.put("/users/:id/status", updateUserStatus);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateAdminOrderStatus);

// Finance Routes 
router.get("/finance/transactions", getAllTransactions);
router.get("/finance/payouts", getAllPayouts); 

export default router;