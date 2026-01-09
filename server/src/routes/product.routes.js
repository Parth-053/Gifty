import { Router } from "express";
import { 
  getAllProducts, 
  getProductDetails, 
  getPublicCategories 
} from "../controllers/public/product.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { getProductsSchema } from "../validations/product.validation.js";

const router = Router();

// 🔓 All Public
router.get("/", validate(getProductsSchema, 'query'), getAllProducts);
router.get("/categories", getPublicCategories);
router.get("/:id", getProductDetails);

export default router;