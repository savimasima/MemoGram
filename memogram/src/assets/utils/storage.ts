const LIKE_KEY = "memogram_likes_v1";

type LikeState = {
  liked: Record<string, true>;
  counts: Record<string, number>;
};

function read(): LikeState {
  try {
    const raw = localStorage.getItem(LIKE_KEY);
    if (!raw) return { liked: {}, counts: {} };
    return JSON.parse(raw) as LikeState;
  } catch {
    return { liked: {}, counts: {} };
  }
}

function write(state: LikeState) {
  localStorage.setItem(LIKE_KEY, JSON.stringify(state));
}

export function getLikeState(id: string) {
  const s = read();
  return { active: !!s.liked[id], count: s.counts[id] ?? 0 };
}

export function toggleLike(id: string) {
  const s = read();
  const isActive = !!s.liked[id];

  if (isActive) {
    delete s.liked[id];
    s.counts[id] = Math.max(0, (s.counts[id] ?? 1) - 1);
  } else {
    s.liked[id] = true;
    s.counts[id] = (s.counts[id] ?? 0) + 1;
  }

  write(s);
  return { active: !isActive, count: s.counts[id] ?? 0 };
}

export function resetLikes() {
  localStorage.removeItem(LIKE_KEY);
}
