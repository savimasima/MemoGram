import { useMemo, useState } from "react";
import { MEMES } from "./data/memes";
import { MemeCard } from "./components/MemeCard";
import { resetLikes } from "./utils/storage";


export default function App() {
  const [query, setQuery] = useState("");

  const [sort, setSort] = useState<"new" | "rand">("new");


  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = MEMES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.caption ?? "").toLowerCase().includes(q) ||
        (m.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );

    if (sort === "rand") {
      arr = [...arr].sort(() => Math.random() - 0.5);
    } else {
      arr = [...arr].sort((a, b) =>
        (b.createdAt ?? "") > (a.createdAt ?? "") ? 1 : -1
      );
    }
    return arr;
  }, [query, sort]);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand" aria-label="Memogram">
            <div className="brand-badge">M</div>
            <div>Memogram</div>
          </div>

          <div className="actions">
            <select
              className="button"
              value={sort}
              onChange={(e) => setSort(e.target.value as "new" | "rand")}
              aria-label="Sort feed"
            >
              <option value="new">Newest</option>
              <option value="rand">Shuffle</option>
            </select>

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

      <div className="container">
        <input
          className="searchbar"
          placeholder="Search memes… (title, caption, tags)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search memes"
        />

        <div className="grid" role="list" aria-label="Memogram feed grid">
          {items.map((m) => (
            <div role="listitem" key={m.id}>
              <MemeCard meme={m} />
            </div>
          ))}

          {items.length === 0 && (
            <div className="card" style={{ padding: 16 }}>
              <div className="card-inner">
                <div className="card-title">No results</div>
                <div className="card-caption">
                  Try a different search term or clear the query.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}