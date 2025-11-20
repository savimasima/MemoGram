import { useEffect, useMemo, useState } from "react";
import { fetchMemes } from "./api/memeApi";
import type { Meme } from "./types";
import { MemeCard } from "./components/MemeCard";
import { resetLikes } from "./utils/storage";

const SUBREDDITS = ["", "memes", "dankmemes", "me_irl", "wholesomememes"];

export default function App() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "rand">("new");
  const [subreddit, setSubreddit] = useState<string>("");
  const [items, setItems] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr(null);
    fetchMemes({ count: 18, subreddit: subreddit || undefined, signal: ac.signal })
      .then((list) => {
        const mapped: Meme[] = list.map((m, idx) => ({
          id: `${m.subreddit}:${m.postLink}:${idx}`,
          title: m.title,
          caption: `${m.subreddit} • ↑${m.ups}`,
          imageUrl: m.url,
          tags: [m.subreddit],
          createdAt: new Date().toISOString(), 
          sourceLink: m.postLink,
          author: m.author,
          subreddit: m.subreddit
        }));
        setItems(mapped);
      })
      .catch((e) => setErr(e.message || "Failed to load memes"))
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [subreddit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.caption ?? "").toLowerCase().includes(q) ||
        (m.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
    if (sort === "rand") {
      arr = [...arr].sort(() => Math.random() - 0.5);
    } else {
      arr = [...arr]; 
    }
    return arr;
  }, [items, query, sort]);

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand" aria-label="Memogram">
            <div className="brand-badge">M</div>
            <div>Memogram</div>
          </div>

          <div className="actions">
            {/* Subreddit source */}
            <select
              className="button"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              aria-label="Choose subreddit source"
              title="Choose source"
            >
              <option value="">Mixed (default)</option>
              {SUBREDDITS.slice(1).map((s) => (
                <option key={s} value={s}>{`r/${s}`}</option>
              ))}
            </select>

            {/* Sorting */}
            <select
              className="button"
              value={sort}
              onChange={(e) => setSort(e.target.value as "new" | "rand")}
              aria-label="Sort feed"
            >
              <option value="new">Newest</option>
              <option value="rand">Shuffle</option>
            </select>

            {/* Reset likes */}
            <button
              className="button"
              onClick={() => {
                if (confirm("Reset all likes on this device?")) {
                  resetLikes();
                  setSort((s) => (s === "new" ? "rand" : "new"));
                }
              }}
            >
              Reset likes
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="container">
        <input
          className="searchbar"
          placeholder="Search memes… (title, caption, tags)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search memes"
        />

        {err && (
          <div className="card" style={{ padding: 16, marginTop: 16 }}>
            <div className="card-inner">
              <div className="card-title">Load error</div>
              <div className="card-caption">
                {err}. Try changing subreddit or reloading.
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="card" style={{ padding: 16, marginTop: 16 }}>
            <div className="card-inner">
              <div className="card-title">Loading…</div>
              <div className="card-caption">Fetching fresh memes from the API</div>
            </div>
          </div>
        )}

        <div className="grid" role="list" aria-label="Memogram feed grid">
          {filtered.map((m) => (
            <div role="listitem" key={m.id}>
              <MemeCard meme={m} />
            </div>
          ))}

          {!loading && !err && filtered.length === 0 && (
            <div className="card" style={{ padding: 16 }}>
              <div className="card-inner">
                <div className="card-title">No results</div>
                <div className="card-caption">Try a different query.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}