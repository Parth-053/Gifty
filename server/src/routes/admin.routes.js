import express from "express";
import { adminDashboard } from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  adminDashboard
);

export default router;
