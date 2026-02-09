import { Router } from "express";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../controllers/admin/category.controller.js";
import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";  
import validate from "../../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../../validations/category.schema.js";

const router = Router();

// Public: Get All Categories (Dropdowns need this)
router.get("/", getCategories);

// Protected: Admin Management
router.post(
  "/", 
  verifyAuth, 
  authorizeRoles("admin"), 
  upload.single("image"),
  validate(createCategorySchema),
  createCategory
);

router.put(
  "/:id", 
  verifyAuth, 
  authorizeRoles("admin"), 
  upload.single("image"), 
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  "/:id", 
  verifyAuth, 
  authorizeRoles("admin"), 
  deleteCategory
);

export default router;