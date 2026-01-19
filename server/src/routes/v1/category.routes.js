import { Router } from "express";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../controllers/admin/category.controller.js";
import { verifyJWT, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";  

const router = Router();

// Public Routes

// Get All Categories (Nested/Tree structure support inside controller)
router.get("/", getCategories);

// Protected Admin Routes (Requires Login + 'admin' Role)

// 1. Create Category (Supports Image Upload)
// field name 'image' must match frontend FormData key
router.post(
  "/", 
  verifyJWT, 
  authorizeRoles("admin"), 
  upload.single("image"),
  createCategory
);

// 2. Update Category (Supports Image Update)
router.put(
  "/:id", 
  verifyJWT, 
  authorizeRoles("admin"), 
  upload.single("image"), 
  updateCategory
);

router.delete(
  "/:id", 
  verifyJWT, 
  authorizeRoles("admin"), 
  deleteCategory
);

export default router;