import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthRequest extends Request {
  userId?: string;
  user?: { id: string; email: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = AuthService.extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const payload = AuthService.verifyToken(token);
    req.userId = payload.userId;
    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
