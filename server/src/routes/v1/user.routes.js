import { Router } from "express";
import { 
  getMyProfile, 
  updateUserProfile, 
  deactivateAccount 
} from "../../controllers/user/profile.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { updateUserProfileSchema } from "../../validations/user.schema.js";

const router = Router();

router.use(verifyAuth); 

router.route("/profile")
  .get(getMyProfile)
  .put(
    upload.single("avatar"), 
    validate(updateUserProfileSchema),
    updateUserProfile
  )
  .delete(deactivateAccount);

export default router;