import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      res.status(401).json({ error: "Authorization header required" });
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: "Bearer token required" });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: "Token not provided" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable not set");
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    if (!decoded.sub) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    req.userId = decoded.sub;
    next();

  } catch (error: unknown) {
    console.error("Auth middleware error:", error);

    if (isError(error)) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: "Token expired" });
        return;
      }

      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      if (error.name === 'NotBeforeError') {
        res.status(401).json({ error: "Token not active" });
        return;
      }

      if (error.message.includes('jwt malformed')) {
        res.status(401).json({ error: "Malformed token" });
        return;
      }

      if (error.message.includes('invalid signature')) {
        res.status(401).json({ error: "Invalid token signature" });
        return;
      }
    }

    res.status(500).json({ error: "Authentication error" });
    return;
  }
}
