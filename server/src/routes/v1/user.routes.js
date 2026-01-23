// server/src/routes/v1/user.routes.js
import { Router } from "express";
import { 
  getMyProfile, 
  updateUserProfile, 
  deactivateAccount 
} from "../../controllers/user/profile.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js"; // Changed from verifyJWT
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

// Apply Authentication Middleware globally for user routes
router.use(verifyAuth); 

router.route("/profile")
  .get(getMyProfile)
  .put(upload.single("avatar"), updateUserProfile) // Handle image upload
  .delete(deactivateAccount);

export default router;