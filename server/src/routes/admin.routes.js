import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { UserRoles } from "../utils/constants.js";

// Controllers
import { getAdminStats } from "../controllers/admin/adminDashboard.controller.js";
import { 
  getAllUsers, 
  updateUserStatus, 
  verifySeller 
} from "../controllers/admin/adminUsers.controller.js";
import { 
  createCategory, 
  getCategories,
  updateCategory, 
  deleteCategory 
} from "../controllers/admin/adminCategories.controller.js";

const router = Router();

// 🔒 Strict Admin Security
router.use(verifyJWT, authorizeRoles(UserRoles.ADMIN));

// Dashboard
router.get("/dashboard", getAdminStats);

// Users & Sellers
router.get("/users", getAllUsers);
router.patch("/users/:userId/status", updateUserStatus);
router.patch("/sellers/:sellerId/verify", verifySeller);

// Categories
router.route("/categories")
  .get(getCategories)
  .post(createCategory);

router.route("/categories/:id")
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;