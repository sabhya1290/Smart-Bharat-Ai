import { Router } from 'express';
import {
  listServices,
  getServiceById,
  bookmarkService,
  removeBookmark,
  listBookmarkedServices,
} from '../controllers/servicesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/bookmarked', requireAuth, listBookmarkedServices);
router.get('/', listServices);
router.get('/:id', getServiceById);
router.post('/:id/bookmark', requireAuth, bookmarkService);
router.delete('/:id/bookmark', requireAuth, removeBookmark);

export default router;
