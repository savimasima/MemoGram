import { Router } from "express";
import { authRequired } from "../auth";
import { prisma } from "../prisma";

const router = Router();

router.get("/", authRequired, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user);
});

export default router;