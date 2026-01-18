import { Router } from "express";
import { 
  register, 
  login, 
  logout, 
  refresh, 
  getCurrentUser 
} from "../../controllers/auth/auth.controller.js";
import { 
  changePassword, 
  forgotPassword, 
  resetPassword 
} from "../../controllers/auth/password.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema 
} from "../../validations/auth.schema.js"; 

const router = Router();

// Public Routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Secured Routes
router.post("/logout", verifyJWT, logout);
router.post("/change-password", verifyJWT, validate(changePasswordSchema), changePassword);
router.get("/me", verifyJWT, getCurrentUser);

export default router;