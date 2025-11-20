import type{ Meme } from "../types";
import { LikeButton } from "./LikeButton";

function TextMeme({ title, caption }: { title: string; caption?: string }) {
  return (
    <div
      className="card-img"
      style={{
        display: "grid",
        placeItems: "center",
        padding: 16,
        background:
          "linear-gradient(135deg, rgba(139,92,246,.35), rgba(34,211,238,.25))"
      }}
      role="img"
      aria-label={caption ? `${title} — ${caption}` : title}
    >
      <div style={{ textAlign: "center", textTransform: "uppercase" }}>
        <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1.1 }}>
          {title}
        </div>
        {caption && (
          <div style={{ marginTop: 8, opacity: 0.9, fontSize: 16 }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

export function MemeCard({ meme }: { meme: Meme }) {
  return (
    <article className="card" aria-label={meme.title}>
      {meme.imageUrl ? (
        <img
          src={meme.imageUrl}
          alt={meme.caption ? `${meme.title} — ${meme.caption}` : meme.title}
          className="card-img"
          loading="lazy"
        />
      ) : (
        <TextMeme title={meme.title} caption={meme.caption} />
      )}

      <div className="card-inner">
        <div className="card-title">{meme.title}</div>
        {meme.caption && <div className="card-caption">{meme.caption}</div>}
        {meme.sourceLink && (
          <a
            href={meme.sourceLink}
            target="_blank"
            rel="noreferrer"
            className="card-caption"
            style={{ textDecoration: "none" }}
          >
            View on Reddit → 
          </a>
        )}
        <div className="footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <LikeButton memeId={meme.id} />
          <div className="badge">
            {(meme.tags ?? []).join(" • ") || "meme"}
          </div>
        </div>
      </div>
    </article>
  );
}
