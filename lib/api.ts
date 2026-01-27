export class ApiClientError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = "ApiClientError";
  }
}

class ApiClient {
  private baseUrl: string;

  private tokenKey: string;
  private storageType: 'local' | 'session';

  constructor(baseUrl: string, tokenKey: string = "auth_token", storageType: 'local' | 'session' = 'local') {
    this.baseUrl = baseUrl;
    this.tokenKey = tokenKey;
    this.storageType = storageType;
  }

  private get headers() {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        if (this.storageType === 'session') {
            token = sessionStorage.getItem(this.tokenKey);
        } else {
            token = localStorage.getItem(this.tokenKey);
        }
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (optional: redirect to login)
      }
      throw new ApiClientError(
        data.error || "An error occurred",
        response.status
      );
    }

    return data;
  }

  get<T>(path: string) {
    return this.fetch<T>(path, { method: "GET" });
  }

  post<T>(path: string, body: any) {
    return this.fetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: any) {
    return this.fetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: any) {
    return this.fetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string) {
    return this.fetch<T>(path, { method: "DELETE" });
  }
}

// Use relative paths since API is in the same codebase
const API_URL = "/api";

// Client for user actions (localStorage, auth_token)
const client = new ApiClient(API_URL);

// Client for admin actions (sessionStorage, admin_token)
const adminClient = new ApiClient(API_URL, "admin_token", "session");

export const authApi = {
  getMe: () => client.get<{ user: any }>("/auth/me"),
  login: (data: any) =>
    client.post<{ token: string; user: any }>("/auth/login", data),
  signup: (data: any) =>
    client.post<{ token: string; user: any }>("/auth/signup", data),
  forgotPassword: (email: string) =>
    client.post("/auth/forgot-password", { email }),
  resetPassword: (data: any) => client.post("/auth/reset-password", data),
  updateProfile: (data: any) => client.patch<{ user: any }>("/auth/me", data),
  logout: () => client.post("/auth/logout", {}),
};

export const gameApi = {
  syncSession: () => client.get<{ session: any; state: any }>("/game/session"),
  getSession: (userId?: string) =>
    client.get<{ session: any; state: any }>(
      `/game/session${userId ? `?userId=${userId}` : ""}`
    ),
  updateSession: (data: any) => client.post("/game/session", data),
  solveRiddle: (data: any) =>
    client.post<{ correct: boolean; gemsEarned: number }>("/game/solve", data),
  getHint: (data: any) =>
    client.post<{ gemsSpent: number }>("/game/hint", data),
  recordAttempt: (data: any) => client.post("/game/attempt", data),
  getAttempts: (userId: string, options?: any) => {
    const searchParams = new URLSearchParams({ userId });
    if (options?.riddleId) searchParams.append("riddleId", options.riddleId);
    if (options?.limit) searchParams.append("limit", String(options.limit));
    return client.get<any>(`/game/attempts?${searchParams.toString()}`);
  },
  submitAttempt: (data: {
    riddleId: string;
    solved: boolean;
    usedHint: boolean;
  }) => client.post<{ success: boolean; stats: any }>("/game/attempt", data),
};

export const adminApi = {
  getStats: () => adminClient.get<{ stats: any }>("/admin/stats"),
  getActivity: (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, String(value));
    });
    return adminClient.get<any>(`/admin/activity?${searchParams.toString()}`);
  },
  getUsers: (params: { page: number; pageSize: number; search?: string }) => {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    if (params.search) searchParams.append("search", params.search);
    return adminClient.get<any>(`/admin/users?${searchParams.toString()}`);
  },
  getSettings: () => adminClient.get<{ settings: any }>("/admin/settings"),
  updateSettings: (data: any) =>
    adminClient.patch<{ message: string; settings: any }>("/admin/settings", data),
  getRiddles: (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, String(value));
    });
    return adminClient.get<any>(`/admin/riddles?${searchParams.toString()}`);
  },
  createRiddle: (data: any) => adminClient.post("/admin/riddles", data),
  updateRiddle: (id: string, data: any) =>
    adminClient.patch(`/admin/riddles?id=${id}`, data),
  deleteRiddle: (id: string) => adminClient.delete(`/admin/riddles?id=${id}`),
};
