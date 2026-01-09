import { Router } from "express";
import { 
  register, 
  login, 
  logout, 
  refresh, 
  getCurrentUser 
} from "../controllers/auth/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema 
} from "../validations/auth.validation.js";

const router = Router();

// 🔓 Public Routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refresh);

// 🔒 Protected Routes
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);

export default router;