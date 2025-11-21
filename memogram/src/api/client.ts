const API_BASE = "http://localhost:4000/api";

export type User = {
  id: number;
  email: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

function getAuthToken(): string | null {
  return localStorage.getItem("memogram_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (typeof (data as any).error === "string") {
        message = (data as any).error;
      }
    } catch {
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  register(body: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body: { emailOrUsername: string; password: string }) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  me() {
    return request<User>("/me");
  },
};