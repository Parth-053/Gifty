import { Router } from "express";
import { 
  addProduct, 
  getMyInventory, 
  editProduct, 
  removeProduct 
} from "../../controllers/seller/inventory.controller.js";
import { 
  getSellerOrders, 
  updateOrderItemStatus 
} from "../../controllers/seller/orders.controller.js";
import { 
  getFinanceStats, 
  getTransactionHistory, 
  requestPayout 
} from "../../controllers/seller/finance.controller.js";
import { verifyJWT, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../../validations/product.schema.js";

const router = Router();

// Protect all routes: Must be Logged In AND be a Seller
router.use(verifyJWT, authorizeRoles("seller"));

// Inventory Management
router.route("/inventory")
  .get(getMyInventory)
  .post(
    upload.array("images", 5), // Allow up to 5 images
    validate(createProductSchema), 
    addProduct
  );

router.route("/inventory/:id")
  .put(
    upload.array("images", 5), 
    validate(updateProductSchema), 
    editProduct
  )
  .delete(removeProduct);

// Order Management
router.get("/orders", getSellerOrders);
router.put("/orders/:orderId/item/:itemId", updateOrderItemStatus);

// Finance & Analytics
router.get("/finance/stats", getFinanceStats);
router.get("/finance/transactions", getTransactionHistory);
router.post("/finance/withdraw", requestPayout);

export default router;