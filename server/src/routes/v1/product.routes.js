import { Router } from "express";
import { 
  getProducts, 
  getProductDetails 
} from "../../controllers/shop/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductDetails);

export default router;