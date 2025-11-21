import { Router } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signToken } from "../auth";

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/i),
  password: z.string().min(6),
  displayName: z.string().min(1).max(50).optional()
});

router.post("/register", async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email, username, password, displayName } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });

  if (existing) {
    return res.status(409).json({ error: "Email or username already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, username, passwordHash, displayName }
  });

  const token = signToken({ id: user.id });
  const { passwordHash: _ignored, ...safeUser } = user;

  return res.status(201).json({ token, user: safeUser });
});

const LoginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(6)
});

router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { emailOrUsername, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }]
    }
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ id: user.id });
  const { passwordHash: _ignored, ...safeUser } = user;

  return res.json({ token, user: safeUser });
});

export default router;