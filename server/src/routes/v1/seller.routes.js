import { Router } from "express";
import { 
  addProduct, 
  getMyInventory, 
  editProduct, 
  deleteProduct,
  getProductDetails  
} from "../../controllers/seller/inventory.controller.js";
import { 
  getDashboardStats, 
  getDashboardChart 
} from "../../controllers/seller/dashboard.controller.js";
import { 
  getSellerOrders, 
  updateOrderItemStatus, 
  getSellerOrderDetails 
} from "../../controllers/seller/orders.controller.js";
import { 
  getFinanceStats, 
  getTransactionHistory, 
  requestPayout,
  getPayoutHistory,
  getSalesGraph  
} from "../../controllers/seller/finance.controller.js";
import { 
  getProfile, 
  updateProfile 
} from "../../controllers/seller/profile.controller.js";  

import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();
 
// Protect all routes
// This middleware MUST populate req.user or req.seller
router.use(verifyAuth, authorizeRoles("seller"));

// --- Dashboard ---
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/chart", getDashboardChart);

// --- Inventory (Products) ---
router.route("/products")
  .get(getMyInventory)
  .post(upload.array("images", 5), addProduct);

router.route("/products/:id")
  .get(getProductDetails) 
  .put(upload.array("images", 5), editProduct)
  .delete(deleteProduct);

// --- Orders ---
router.get("/orders", getSellerOrders);
router.get("/orders/:id", getSellerOrderDetails);
router.patch("/orders/:orderId/items/:itemId", updateOrderItemStatus);

// --- Finance ---
router.get("/finance/stats", getFinanceStats);
router.get("/finance/transactions", getTransactionHistory);
router.get("/finance/payouts", getPayoutHistory);
router.get("/finance/graph", getSalesGraph);
router.post("/finance/withdraw", requestPayout);

// --- Profile --- 
router.get("/profile", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile);

export default router;