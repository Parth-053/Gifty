import { Router } from "express";
import * as authController from "../../controllers/auth/auth.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { syncUserSchema, syncSellerSchema } from "../../validations/auth.schema.js";

const router = Router();

// Public / Hybrid
router.post(
  "/sync/user",
  verifyAuth,
  validate(syncUserSchema),
  authController.syncUser
);

router.post(
  "/sync/seller",
  verifyAuth,
  validate(syncSellerSchema),
  authController.syncSeller
);

// Protected
router.get("/me", verifyAuth, authController.getMe);
router.post("/logout", verifyAuth, authController.logout);

export default router;