import { Router } from "express";
import { 
  getNotifications, 
  markAllAsRead, 
  deleteNotification 
} from "../../controllers/common/notification.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

// Apply Auth Middleware (Works for Admin, User, Seller)
router.use(verifyAuth);

router.get("/", getNotifications);
router.patch("/read", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;