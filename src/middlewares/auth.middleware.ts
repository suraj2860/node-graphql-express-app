import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import User from '../models/user';

const SECRET_KEY = process.env.JWT_TOKEN_SECRET || 'my-secret-key';

export interface AuthContext {
  user?: Partial<User>;
}

export const authMiddleware = async (req: Request): Promise<AuthContext> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return {};
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    throw new AuthenticationError('Authorization token missing or invalid');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as Partial<User>;
    return { user: decoded };
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};
