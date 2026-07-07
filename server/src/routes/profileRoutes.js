import { Router } from 'express';
import { updateProfile } from '../controllers/profileController.js';
import { getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/profileValidators.js';

const router = Router();

router.get('/', requireAuth, getMe);
router.put('/', requireAuth, validateBody(updateProfileSchema), updateProfile);

export default router;
