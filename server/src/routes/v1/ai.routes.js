import { Router } from "express";
import { getGiftSuggestions, getGiftMessage } from "../../controllers/shop/ai.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyAuth); 

router.post("/suggest", getGiftSuggestions);
router.post("/message", getGiftMessage);

export default router;