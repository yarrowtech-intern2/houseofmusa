import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginInput } from "@houseofmusa/schemas";
import { Admin } from "../models/Admin";
import { env } from "../config/env";
import { ApiError } from "../middleware/errorHandler";
import type { AuthTokenPayload } from "../middleware/auth";

const COOKIE_NAME = "hom_admin_token";

export async function login(req: Request<unknown, unknown, LoginInput>, res: Response) {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+passwordHash");
  if (!admin) throw new ApiError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const payload: AuthTokenPayload = { sub: admin.id, email: admin.email, role: admin.role };
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME);
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  res.json({ admin: req.admin });
}
