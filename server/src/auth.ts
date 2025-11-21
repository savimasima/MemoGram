import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ENV } from "./env";

type JwtPayload = { id: number };

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    req.userId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}