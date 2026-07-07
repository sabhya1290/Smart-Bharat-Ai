import { Router } from 'express';
import { createIssue, listMyIssues, getIssueByComplaintId } from '../controllers/issuesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import { createIssueSchema } from '../validators/issueValidators.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', requireAuth, upload.single('image'), validateBody(createIssueSchema), createIssue);
router.get('/mine', requireAuth, listMyIssues);
router.get('/:complaintId', getIssueByComplaintId);

export default router;
