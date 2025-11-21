import { useEffect, useMemo, useState, FormEvent } from "react";
import { fetchMemes } from "./api/memeApi";
import type { Meme } from "./types";
import { MemeCard } from "./components/MemeCard";
import { useAuth } from "./auth/AuthContext";

const SUBREDDITS = ["", "memes", "dankmemes", "me_irl", "wholesomememes"];

export default function App() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "rand">("new");
  const [subreddit, setSubreddit] = useState<string>("");
  const [items, setItems] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const {
    user,
    loading: authLoading,
    error: authError,
    login,
    register,
    logout,
  } = useAuth();

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr(null);
    fetchMemes({
      count: 18,
      subreddit: subreddit || undefined,
      signal: ac.signal,
    })
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
          subreddit: m.subreddit,
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
      <header className="header">
        <div className="header-inner">
          <div className="brand" aria-label="Memogram">
            <div className="brand-badge">M</div>
            <div>Memogram</div>
          </div>

          <div
            className="actions"
            style={{ gap: 12, alignItems: "center", display: "flex" }}
          >
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

            <select
              className="button"
              value={sort}
              onChange={(e) => setSort(e.target.value as "new" | "rand")}
              aria-label="Sort feed"
            >
              <option value="new">Newest</option>
              <option value="rand">Shuffle</option>
            </select>

            {authLoading ? (
              <span style={{ fontSize: 12, opacity: 0.7 }}>Checking session…</span>
            ) : user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>
                  Signed in as <strong>{user.username}</strong>
                </span>
                <button
                  className="button"
                  type="button"
                  onClick={logout}
                  style={{ fontSize: 12, paddingInline: 10 }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <span style={{ fontSize: 13, opacity: 0.8 }}>Not signed in</span>
            )}
          </div>
        </div>
      </header>

      <div className="container">
        {!authLoading && !user && (
          <AuthForms
            authError={authError}
            onLogin={login}
            onRegister={register}
          />
        )}

        <input
          className="searchbar"
          placeholder="Search memes… (title, caption, tags)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search memes"
        />

        {err && !loading && items.length === 0 && (
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

type AuthFormsProps = {
  authError: string | null;
  onLogin: (data: { emailOrUsername: string; password: string }) => Promise<void>;
  onRegister: (data: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
};

function AuthForms({ authError, onLogin, onRegister }: AuthFormsProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [pending, setPending] = useState(false);

  const [loginEmailOrUsername, setLoginEmailOrUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDisplayName, setRegDisplayName] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await onLogin({
        emailOrUsername: loginEmailOrUsername,
        password: loginPassword,
      });
    } finally {
      setPending(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await onRegister({
        email: regEmail,
        username: regUsername,
        password: regPassword,
        displayName: regDisplayName || undefined,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="card"
      style={{ padding: 16, marginBottom: 16, maxWidth: 480 }}
    >
      <div className="card-inner">
        <div className="card-title">
          {mode === "login" ? "Sign in to Memogram" : "Create a Memogram account"}
        </div>

        {authError && (
          <div style={{ color: "#e11d48", fontSize: 13, marginBottom: 8 }}>
            {authError}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            fontSize: 12,
          }}
        >
          <button
            type="button"
            className="button"
            onClick={() => setMode("login")}
            style={{ opacity: mode === "login" ? 1 : 0.6 }}
          >
            Login
          </button>
          <button
            type="button"
            className="button"
            onClick={() => setMode("register")}
            style={{ opacity: mode === "register" ? 1 : 0.6 }}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <input
              className="searchbar"
              placeholder="Email or username"
              value={loginEmailOrUsername}
              onChange={(e) => setLoginEmailOrUsername(e.target.value)}
            />
            <input
              className="searchbar"
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="button" type="submit" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <input
              className="searchbar"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <input
              className="searchbar"
              placeholder="Username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
            />
            <input
              className="searchbar"
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <input
              className="searchbar"
              placeholder="Display name (optional)"
              value={regDisplayName}
              onChange={(e) => setRegDisplayName(e.target.value)}
            />
            <button className="button" type="submit" disabled={pending}>
              {pending ? "Creating account…" : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}