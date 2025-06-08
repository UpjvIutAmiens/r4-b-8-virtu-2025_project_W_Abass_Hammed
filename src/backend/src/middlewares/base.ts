import type { Request, Response, NextFunction } from 'express';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export const requireRequestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.header('X-Request-Id');

  if (!requestId) {
    return res.status(400).json({ error: 'X-Request-Id header is required' });
  }

  if (!uuidValidate(requestId) || uuidVersion(requestId) !== 4) {
    return res.status(400).json({ error: 'X-Request-Id must be a valid UUID v4' });
  }

  next();
};
