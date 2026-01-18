import { Router } from "express";
import { 
  getMyProfile, 
  updateUserProfile, 
  deactivateAccount 
} from "../../controllers/user/profile.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT to all routes below

router.route("/profile")
  .get(getMyProfile)
  .put(upload.single("avatar"), updateUserProfile) // Handle image upload
  .delete(deactivateAccount);

export default router;