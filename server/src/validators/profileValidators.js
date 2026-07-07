import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  ageGroup: z.enum(['under_18', '18_25', '26_35', '36_45', '46_60', '60_plus']).optional().nullable(),
  occupation: z.string().optional().nullable(),
  incomeRange: z
    .enum(['below_2_5l', '2_5l_5l', '5l_10l', 'above_10l', 'not_specified'])
    .optional()
    .nullable(),
  category: z
    .enum(['student', 'farmer', 'worker', 'senior_citizen', 'entrepreneur', 'other'])
    .optional(),
  preferredLanguage: z.enum(['en', 'hi', 'hinglish']).optional(),
  accessibilityPrefs: z
    .object({
      fontScale: z.number().min(0.8).max(1.6).optional(),
      highContrast: z.boolean().optional(),
    })
    .optional(),
});
