import { AppError } from '../utils/AppError.js';

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(422, 'Validation failed.', result.error.flatten().fieldErrors);
  }

  req.body = result.data;
  next();
};
