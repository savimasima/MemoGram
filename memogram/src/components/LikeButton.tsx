import { useEffect, useState } from "react";
import { getLikeState, toggleLike } from "../utils/storage";

export function LikeButton({ memeId }: { memeId: string }) {
  const [{ active, count }, setState] = useState(getLikeState(memeId));

  useEffect(() => {
    setState(getLikeState(memeId));
  }, [memeId]);

  return (
    <button
      className="like"
      data-active={active}
      onClick={() => setState(toggleLike(memeId))}
      aria-pressed={active}
      aria-label={active ? "Unlike" : "Like"}
    >
      <span>❤️</span>
      <span className="like-count">{count}</span>
    </button>
  );
}