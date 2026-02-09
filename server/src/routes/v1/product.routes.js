import { Router } from "express";
import { 
  getProducts, 
  getProductDetails,
  getRelatedProducts
} from "../../controllers/shop/product.controller.js";

const router = Router();

// Public Routes (Customer Facing)
router.get("/", getProducts);
router.get("/:id", getProductDetails);
router.get("/:id/related", getRelatedProducts);

export default router;