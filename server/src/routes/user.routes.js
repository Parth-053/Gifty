import { Router } from "express";
import { 
  updateAccountDetails, 
  changeCurrentPassword 
} from "../controllers/user/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { 
  updateProfileSchema, 
  changePasswordSchema 
} from "../validations/auth.validation.js";

const router = Router();

router.use(verifyJWT); // Apply to all routes below

router.patch("/profile", validate(updateProfileSchema), updateAccountDetails);
router.post("/change-password", validate(changePasswordSchema), changeCurrentPassword);

export default router;