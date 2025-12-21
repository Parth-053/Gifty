import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  getSellerDashboard,
  getSellerAnalytics,
  getSellerProducts,
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
  updateOrderStatus,
  getSellerProfile,
  updateSellerProfile,
} from "../controllers/seller.controller.js";

const router = express.Router();

/* =========================
   DASHBOARD
   ========================= */
router.get(
  "/dashboard",
  protect,
  authorize("seller"),
  getSellerDashboard
);

/* =========================
   SELLER PRODUCTS
   ========================= */
router.get(
  "/products",
  protect,
  authorize("seller"),
  getSellerProducts
);

router.post(
  "/products",
  protect,
  authorize("seller"),
  upload.array("images", 5),
  addSellerProduct
);

router.put(
  "/products/:id",
  protect,
  authorize("seller"),
  updateSellerProduct
);

router.delete(
  "/products/:id",
  protect,
  authorize("seller"),
  deleteSellerProduct
);

/* =========================
   SELLER ORDERS
   ========================= */
router.get(
  "/orders",
  protect,
  authorize("seller"),
  getSellerOrders
);

router.put(
  "/orders/:id/status",
  protect,
  authorize("seller"),
  updateOrderStatus
);

/* =========================
   ANALYTICS
   ========================= */
router.get(
  "/analytics",
  protect,
  authorize("seller"),
  getSellerAnalytics
);

/* =========================
   PROFILE
   ========================= */
router.get(
  "/profile",
  protect,
  authorize("seller"),
  getSellerProfile
);

router.put(
  "/profile",
  protect,
  authorize("seller"),
  updateSellerProfile
);

export default router;
