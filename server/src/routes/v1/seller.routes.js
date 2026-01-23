// server/src/routes/v1/seller.routes.js
import { Router } from "express";
import { 
  addProduct, 
  getMyInventory, 
  editProduct, 
  removeProduct,
  getProductDetails  
} from "../../controllers/seller/inventory.controller.js";
import { 
  getSellerOrders, 
  updateOrderItemStatus 
} from "../../controllers/seller/orders.controller.js";
import { 
  getFinanceStats, 
  getTransactionHistory, 
  requestPayout,
  getPayoutHistory  
} from "../../controllers/seller/finance.controller.js";
import { 
  updateSellerProfile, 
  updateStoreSettings 
} from "../../controllers/seller/profile.controller.js";  

import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js"; // Changed from verifyJWT
import { upload } from "../../middlewares/multer.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

// Note: Ensure these schemas are updated to reflect any model changes
import { createProductSchema, updateProductSchema } from "../../validations/product.schema.js";
import { updateSellerProfileSchema } from "../../validations/seller.schema.js"; 

const router = Router();
 
// Protect all routes: Must be Authenticated AND have 'seller' role
router.use(verifyAuth, authorizeRoles("seller"));

// 1. Inventory Management
router.route("/inventory")
  .get(getMyInventory) // Supports Search & Pagination
  .post(
    upload.array("images", 5), // Matches frontend: Add Photo
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
  .delete(removeProduct); // Soft delete implementation

// 2. Order Management
router.get("/orders", getSellerOrders); // For OrderList.jsx
router.put("/orders/:orderId/item/:itemId", updateOrderItemStatus); // Logic for processing/shipped

// 3. Finance & Payouts
router.get("/finance/stats", getFinanceStats); // For Dashboard stats
router.get("/finance/transactions", getTransactionHistory);
router.get("/finance/payouts", getPayoutHistory); // For PayoutHistory.jsx
router.post("/finance/withdraw", requestPayout);

// 4. Profile & Store Settings
// Note: Removed updateStoreSettingsSchema validation temporarily if schema not updated
router.put("/profile/me", validate(updateSellerProfileSchema), updateSellerProfile); 
router.put("/profile/store", updateStoreSettings); 

export default router;