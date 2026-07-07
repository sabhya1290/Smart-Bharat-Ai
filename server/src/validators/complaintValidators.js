import { z } from 'zod';

export const addComplaintUpdateSchema = z.object({
  status: z.enum(['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed']),
  note: z.string().optional(),
});
