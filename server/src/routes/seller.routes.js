import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { UserRoles } from "../utils/constants.js";
import { createProductSchema, updateProductSchema } from "../validations/product.validation.js";

// Controllers
import { 
  registerNewSeller, 
  getMySellerProfile, 
  updateStoreDetails 
} from "../controllers/seller/sellerProfile.controller.js";
import { 
  addProduct, 
  getMyProducts, 
  updateProductDetails, 
  removeProduct 
} from "../controllers/seller/sellerProduct.controller.js";
import { 
  getSellerOrders, 
  updateOrderProcessStatus 
} from "../controllers/seller/sellerOrder.controller.js";
import { 
  getSellerDashboardStats,
  getSellerGraphData 
} from "../controllers/seller/sellerAnalytics.controller.js";

const router = Router();

// 🔒 Require Login
router.use(verifyJWT);

// --- Onboarding (User -> Seller) ---
router.post("/onboard", 
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 }
  ]), 
  registerNewSeller
);

// 🔒 STRICT: Only Sellers allowed below
router.use(authorizeRoles(UserRoles.SELLER));

// --- Profile ---
router.route("/profile")
  .get(getMySellerProfile)
  .patch(
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "banner", maxCount: 1 }
    ]),
    updateStoreDetails
  );

// --- Products Management ---
router.route("/products")
  .get(getMyProducts)
  .post(
    upload.array("images", 5), // Allow up to 5 images
    validate(createProductSchema), // Validate text fields
    addProduct
  );

router.route("/products/:productId")
  .patch(
    upload.array("images", 5),
    validate(updateProductSchema),
    updateProductDetails
  )
  .delete(removeProduct);

// --- Order Management ---
router.get("/orders", getSellerOrders);
router.patch("/orders/:orderId/status", updateOrderProcessStatus);

// --- Analytics ---
router.get("/analytics/overview", getSellerDashboardStats);
router.get("/analytics/graph", getSellerGraphData);

export default router;