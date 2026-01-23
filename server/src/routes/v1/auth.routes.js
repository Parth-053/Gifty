// server/src/routes/v1/auth.routes.js
import { Router } from 'express';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { syncUser, syncSeller, getMe } from '../../controllers/auth/auth.controller.js';

const router = Router();

// Public Routes (Verified by Firebase Token in Header)
// Frontend sends token -> Backend verifies & Syncs/Creates User in DB
router.post('/sync', verifyAuth, syncUser);
router.post('/sync-seller', verifyAuth, syncSeller);

// Protected Routes
router.get('/me', verifyAuth, getMe);

export default router;