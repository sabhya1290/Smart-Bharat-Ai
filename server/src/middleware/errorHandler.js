import { fail } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res) => {
  fail(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) {
    console.error('[error]', err);
  }

  fail(res, status, message, err.details);
};
