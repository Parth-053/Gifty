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

import { verifyJWT, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../../validations/product.schema.js";
import { updateSellerProfileSchema, updateStoreSettingsSchema } from "../../validations/seller.schema.js"; //

const router = Router();
 
router.use(verifyJWT, authorizeRoles("seller"));

// 1. Inventory Management
router.route("/inventory")
  .get(getMyInventory) // Supports Search & Pagination
  .post(
    upload.array("images", 5), // Matches frontend: Add Photo
    validate(createProductSchema), 
    addProduct
  );

router.route("/inventory/:id")
  .get(getProductDetails) // New: For individual product view
  .put(
    upload.array("images", 5), 
    validate(updateProductSchema), 
    editProduct
  )
  .delete(removeProduct); // Soft delete implementation

// 2. Order Management
router.get("/orders", getSellerOrders); // For OrderList.jsx
router.put("/orders/:orderId/item/:itemId", updateOrderItemStatus); // Logic for processing/shipped

// 3. Finance & Payouts (Merged Finance Routes Logic)
router.get("/finance/stats", getFinanceStats); // For Dashboard stats
router.get("/finance/transactions", getTransactionHistory);
router.get("/finance/payouts", getPayoutHistory); // New: Required for PayoutHistory.jsx
router.post("/finance/withdraw", requestPayout);

// 4. Profile & Store Settings
router.put("/profile/me", validate(updateSellerProfileSchema), updateSellerProfile); // For SellerProfile.jsx
router.put("/profile/store", validate(updateStoreSettingsSchema), updateStoreSettings); // For StoreSettings.jsx

export default router;