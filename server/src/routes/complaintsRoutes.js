import { Router } from 'express';
import { addComplaintUpdate, getComplaintTimeline } from '../controllers/complaintsController.js';
import { validateBody } from '../middleware/validate.js';
import { addComplaintUpdateSchema } from '../validators/complaintValidators.js';

const router = Router();

router.get('/:complaintId/timeline', getComplaintTimeline);
router.post('/:complaintId/updates', validateBody(addComplaintUpdateSchema), addComplaintUpdate);

export default router;
