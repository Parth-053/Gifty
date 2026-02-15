import { Router } from "express";
import { 
  getCategories,
  getRootCategories,
  getSubCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../controllers/admin/category.controller.js";
import { verifyAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";  
import validate from "../../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../../validations/category.schema.js";

const router = Router();

// --- PUBLIC ROUTES (Accessible by Seller & Shop) ---
// This allows the product form to fetch the list
router.get("/", getCategories);
router.get("/root", getRootCategories);
router.get("/sub", getSubCategories);

// --- PROTECTED ROUTES (Admin Only) ---
// All routes below this line require Admin Login
router.use(verifyAuth, authorizeRoles("admin"));

router.post(
  "/", 
  upload.single("image"),
  validate(createCategorySchema),
  createCategory
);

router.put(
  "/:id", 
  upload.single("image"), 
  validate(updateCategorySchema),
  updateCategory
);

router.delete("/:id", deleteCategory);

export default router;