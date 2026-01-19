import { Router } from "express";
import { getBanners, createBanner, deleteBanner } from "../../controllers/admin/banner.controller.js";
import { verifyJWT, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getBanners);

// Admin Only
router.post("/", verifyJWT, authorizeRoles("admin"), createBanner);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteBanner);

export default router;