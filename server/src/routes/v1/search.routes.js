import { Router } from "express";
import { getTrending, performSearch, getSuggestions } from "../../controllers/shop/search.controller.js";

const router = Router();

// GET /api/v1/search/trending
router.get("/trending", getTrending);

// GET /api/v1/search/suggestions?q=app
router.get("/suggestions", getSuggestions);

// GET /api/v1/search?q=apple
router.get("/", performSearch);

export default router;