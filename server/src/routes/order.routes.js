import express from "express";
import {
  placeOrder,
  getUserOrders,
  getSellerOrders,
} from "../controllers/order.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* USER */
router.post("/", protect, placeOrder);

//  /my
router.get("/my", protect, getUserOrders);

/* SELLER */
router.get(
  "/seller",
  protect,
  authorize("seller"),
  getSellerOrders
);

export default router;
