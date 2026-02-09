import { Router } from "express";
import { 
  getBanners, 
  getBanner, 
  createBanner, 
  updateBanner, 
  deleteBanner 
} from "../../controllers/admin/banner.controller.js";
import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

// Public
router.get("/", getBanners);

// Admin Only
router.get(
  "/:id",
  verifyAuth,
  authorizeRoles("admin"),
  getBanner
);

router.post(
  "/", 
  verifyAuth, 
  authorizeRoles("admin"), 
  upload.single("image"), 
  createBanner
);

router.put(
  "/:id", 
  verifyAuth, 
  authorizeRoles("admin"), 
  upload.single("image"), 
  updateBanner
);

router.delete(
  "/:id", 
  verifyAuth, 
  authorizeRoles("admin"), 
  deleteBanner
);

export default router;