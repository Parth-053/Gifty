import { Router } from "express";
import { getGiftSuggestions } from "../../controllers/shop/ai.controller.js";

const router = Router();

router.post("/suggest", getGiftSuggestions);

export default router;