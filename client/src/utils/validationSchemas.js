import { z } from 'zod';

export const registerFormSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const loginFormSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  phone: z.string().optional(),
  state: z.string().optional(),
  ageGroup: z.string().optional(),
  occupation: z.string().optional(),
  incomeRange: z.string().optional(),
  category: z.string().optional(),
  preferredLanguage: z.string().optional(),
});

export const reportIssueFormSchema = z.object({
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().min(10, 'Please describe the issue in at least 10 characters.'),
  address: z.string().min(3, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits.'),
  priority: z.string().min(1, 'Please select a priority.'),
  landmark: z.string().optional(),
});
