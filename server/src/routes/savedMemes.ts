import { Router } from "express";
import { authRequired } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

const router = Router();

const SaveMemeSchema = z.object({
  memeId: z.string().min(1),
  title: z.string().min(1),
  imageUrl: z.string().url(),
  source: z.string().url().optional(),
  subreddit: z.string().optional(),
  author: z.string().optional()
});

router.get("/", authRequired, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const memes = await prisma.savedMeme.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" }
  });

  return res.json(memes);
});

router.post("/", authRequired, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = SaveMemeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const data = parsed.data;

  const existing = await prisma.savedMeme.findUnique({
    where: {
      userId_memeId: {
        userId: req.userId,
        memeId: data.memeId
      }
    }
  });

  if (existing) {
    await prisma.savedMeme.delete({ where: { id: existing.id } });
    return res.json({ saved: false });
  }

  const saved = await prisma.savedMeme.create({
    data: {
      userId: req.userId,
      memeId: data.memeId,
      title: data.title,
      imageUrl: data.imageUrl,
      source: data.source,
      subreddit: data.subreddit,
      author: data.author
    }
  });

  return res.status(201).json({ saved: true, item: saved });
});

export default router;