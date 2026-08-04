import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./errorHandler";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: "super-admin" | "editor" | "recruiter";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : undefined;
  const token = bearer ?? req.cookies?.hom_admin_token;

  if (!token) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    req.admin = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session"));
  }
}
