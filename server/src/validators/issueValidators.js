import { z } from 'zod';

export const createIssueSchema = z.object({
  category: z.enum([
    'garbage_collection',
    'road_damage',
    'streetlight_issue',
    'water_leakage',
    'drainage_problem',
    'broken_footpath',
    'public_safety',
    'other',
  ]),
  description: z.string().min(10, 'Please describe the issue in at least 10 characters.'),
  address: z.string().min(3, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits.'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  landmark: z.string().optional(),
});
