export const ok = (res, data, meta = undefined, status = 200) =>
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });

export const created = (res, data, meta = undefined) => ok(res, data, meta, 201);

export const fail = (res, status, message, details = undefined) =>
  res.status(status).json({ success: false, message, ...(details ? { details } : {}) });
