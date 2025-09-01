import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <>
      {/* Sticky header with brand */}
      <header className="header">
        <div className="header-inner">
          <div className="brand" aria-label="Memogram">
            <div className="brand-badge">M</div>
            <div>Memogram</div>
          </div>

          <div className="actions">
            {/* Placeholder for future controls (sort, reset, etc.) */}
          </div>
        </div>
      </header>

      {/* Main content container */}
      <div className="container">
        {/* Search bar */}
        <input
          className="searchbar"
          placeholder="Search memes… (coming next step)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search memes"
        />

        {/* Responsive grid (cards will be added in step 2) */}
        <div className="grid" role="list" aria-label="Memogram feed grid">
          {/* Empty state for now */}
          <div
            role="listitem"
            className="card"
            aria-label="empty-state"
            style={{ padding: 16 }}
          >
            {/* This is a temporary placeholder; we will render real cards next step */}
            <div className="card-inner">
              <div className="card-title">Welcome to Memogram 👋</div>
              <div className="card-caption">
                Step 1 complete — the UI shell is ready. In the next step we’ll
                add real meme data and likes with localStorage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}