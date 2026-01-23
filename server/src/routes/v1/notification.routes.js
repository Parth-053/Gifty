import { Router } from "express";
import { getNotifications } from "../../controllers/common/notification.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyAuth);

router.get("/", getNotifications);

export default router;