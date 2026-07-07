import { Router } from 'express';
import { getMe, syncProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require a valid Supabase Auth token in the Authorization header
router.get('/me', requireAuth, getMe);
router.post('/sync-profile', requireAuth, syncProfile);

export default router;
