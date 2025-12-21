import express from "express";
import {
  addProduct,
  getSellerProducts,
  getApprovedProducts,
  getProductById,
  approveProduct,
} from "../controllers/product.controller.js";
import { protect, isSeller, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// SELLER
router.post("/", protect, isSeller, addProduct);
router.get("/seller", protect, isSeller, getSellerProducts);

// USER
router.get("/", getApprovedProducts);
router.get("/:id", getProductById);

// ADMIN
router.put("/approve/:id", protect, isAdmin, approveProduct);

export default router;
