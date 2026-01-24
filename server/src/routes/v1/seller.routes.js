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
  getSellerOrderDetails, 
} from "../../controllers/seller/orders.controller.js";
import { 
  getFinanceStats, 
  getTransactionHistory, 
  requestPayout,
  getPayoutHistory,
  getSalesGraph  
} from "../../controllers/seller/finance.controller.js";
import { 
  updateSellerProfile, 
  updateStoreSettings,
  updateBankDetails,
  getSellerProfile
} from "../../controllers/seller/profile.controller.js";  

import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../../validations/product.schema.js";
import { updateSellerProfileSchema, updateStoreSettingsSchema } from "../../validations/seller.schema.js";

const router = Router();
 
// Protect all routes: Must be Authenticated AND have 'seller' role
router.use(verifyAuth, authorizeRoles("seller"));

// --- 0. Dashboard  ---
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/chart", getDashboardChart);

// --- 1. Inventory Management ---
router.route("/inventory")
  .get(getMyInventory)
  .post(
    upload.array("images", 5), 
    validate(createProductSchema), 
    addProduct
  );

router.route("/inventory/:id")
  .get(getProductDetails) 
  .put(
    upload.array("images", 5), 
    validate(updateProductSchema), 
    editProduct
  )
  .delete(deleteProduct);

// --- 2. Order Management ---
router.get("/orders", getSellerOrders);
router.get("/orders/:id", getSellerOrderDetails);
router.patch("/orders/:orderId/items/:itemId", updateOrderItemStatus);

// --- 3. Finance & Payouts ---
router.get("/finance/stats", getFinanceStats);
router.get("/finance/transactions", getTransactionHistory);
router.get("/finance/payouts", getPayoutHistory);
router.get("/finance/graph", getSalesGraph);
router.post("/finance/withdraw", requestPayout);

// --- 4. Profile & Settings ---
router.get("/profile", getSellerProfile);
router.patch("/profile", validate(updateSellerProfileSchema), updateSellerProfile); 
router.patch("/store", validate(updateStoreSettingsSchema), updateStoreSettings);
router.patch("/bank", updateBankDetails);  

export default router;