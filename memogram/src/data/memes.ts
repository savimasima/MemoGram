import type { Meme } from "../types";

export const MEMES: Meme[] = [
  {
    id: "1",
    title: "When prod works on Friday deploy",
    caption: "…but nobody knows why",
    imageUrl: "https://placehold.co/800x800/png?text=Friday+Deploy",
    tags: ["dev", "ops"],
    createdAt: "2025-08-30T10:20:00Z"
  },
  {
    id: "2",
    title: "Me: just a small refactor",
    caption: "Also me: rewrites entire app",
    // text-only tile (no imageUrl)
    tags: ["dev", "refactor"],
    createdAt: "2025-08-29T08:00:00Z"
  },
  {
    id: "3",
    title: "CSS be like",
    caption: "works on my machine",
    imageUrl: "https://placehold.co/800x800/png?text=CSS+be+like",
    tags: ["css"],
    createdAt: "2025-08-28T14:05:00Z"
  },
  {
    id: "4",
    title: "Unit tests",
    caption: "100% coverage, 0% confidence",
    tags: ["testing", "lol"],
    createdAt: "2025-08-27T19:30:00Z"
  },
  {
    id: "5",
    title: "AI writing commit messages",
    caption: "feat: fix stuff idk 🫡",
    imageUrl: "https://placehold.co/800x800/png?text=AI+Commit",
    tags: ["ai", "git"],
    createdAt: "2025-08-26T12:10:00Z"
  },
  {
    id: "6",
    title: "Ticket says ‘2h task’",
    caption: "…three sprints later",
    tags: ["pm", "jira"],
    createdAt: "2025-08-25T09:45:00Z"
  }
];
