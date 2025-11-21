import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  import { api, type User } from "../api/client";
  
  type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (input: { emailOrUsername: string; password: string }) => Promise<void>;
    register: (input: {
      email: string;
      username: string;
      password: string;
      displayName?: string;
    }) => Promise<void>;
    logout: () => void;
  };
  
  const AuthContext = createContext<AuthState | undefined>(undefined);
  
  const TOKEN_KEY = "memogram_token";
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // Try to restore session on first load
    useEffect(() => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
  
      api
        .me()
        .then((u) => {
          setUser(u);
        })
        .catch(() => {
          // If token is invalid, remove it
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        })
        .finally(() => setLoading(false));
    }, []);
  
    async function handleAuthResult(
      fn: () => Promise<{ token: string; user: User }>
    ) {
      setError(null);
      try {
        const res = await fn();
        localStorage.setItem(TOKEN_KEY, res.token);
        setUser(res.user);
      } catch (e: any) {
        setError(e.message || "Authentication failed");
        throw e;
      }
    }
  
    async function login(input: {
      emailOrUsername: string;
      password: string;
    }) {
      await handleAuthResult(() => api.login(input));
    }
  
    async function register(input: {
      email: string;
      username: string;
      password: string;
      displayName?: string;
    }) {
      await handleAuthResult(() => api.register(input));
    }
  
    function logout() {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setError(null);
    }
  
    const value: AuthState = {
      user,
      loading,
      error,
      login,
      register,
      logout,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  
  export function useAuth(): AuthState {
    const ctx = useContext(AuthContext);
    if (!ctx) {
      throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
  }
  