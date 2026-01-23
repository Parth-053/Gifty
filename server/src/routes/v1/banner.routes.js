import { Router } from "express";
import { getBanners, createBanner, deleteBanner } from "../../controllers/admin/banner.controller.js";
import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

// Public
router.get("/", getBanners);

// Admin Only
router.post(
  "/", 
  verifyAuth, 
  authorizeRoles("admin"), 
  upload.single("image"), 
  createBanner
);

router.delete(
  "/:id", 
  verifyAuth, 
  authorizeRoles("admin"), 
  deleteBanner
);

export default router;