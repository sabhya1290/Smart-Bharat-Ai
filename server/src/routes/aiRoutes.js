import { Router } from 'express';
import { sendChatMessage, getChatHistory } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import { chatMessageSchema } from '../validators/aiValidators.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/chat', requireAuth, aiRateLimiter, validateBody(chatMessageSchema), sendChatMessage);
router.get('/chat/history', requireAuth, getChatHistory);

export default router;
