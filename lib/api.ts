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

  mysteryBox: {
    list: () => client.get<{ boxes: any[] }>("/mystery-box"),
    open: (data: { userId: string; boxId: string }) =>
      client.post<{
        success: boolean;
        userId: string;
        box: any;
        reward: any;
        gemsSpent: number;
        gemsGained: number;
        newGems: number;
        opening: any;
      }>("/mystery-box/open", data),
    history: (userId: string) =>
      client.get<{ openings: any[] }>(`/mystery-box/history?userId=${encodeURIComponent(userId)}`),
  },

  riddleCreator: {
    list: (params?: { status?: string; sort?: string; page?: number; pageSize?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append("status", params.status);
      if (params?.sort) searchParams.append("sort", params.sort);
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.pageSize) searchParams.append("pageSize", String(params.pageSize));
      const qs = searchParams.toString();
      return client.get<any>(`/riddle-creator${qs ? `?${qs}` : ""}`);
    },
    submit: (data: {
      question: string;
      answer: string | string[];
      difficulty: string;
      category?: string;
      hint1?: string;
      hint2?: string;
      tags?: string | string[];
    }) => client.post<any>("/riddle-creator", data),
    vote: (data: { userRiddleId: string; value: 1 | -1 }) =>
      client.post<any>("/riddle-creator/vote", data),
    myRiddles: () => client.get<any>("/riddle-creator/my-riddles"),
  },
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

  dailyChallenge: {
    list: (params: { from?: string; to?: string }) => {
      const searchParams = new URLSearchParams();
      if (params.from) searchParams.append("from", params.from);
      if (params.to) searchParams.append("to", params.to);
      const qs = searchParams.toString();
      return adminClient.get<any>(`/admin/daily-challenge${qs ? `?${qs}` : ""}`);
    },
    upsert: (data: { date: string; riddleId: string; bonusGems?: number }) =>
      adminClient.post<any>("/admin/daily-challenge", data),
    delete: (id: string) => adminClient.delete(`/admin/daily-challenge?id=${id}`),
    seed: (days: number) => adminClient.post<any>("/admin/daily-challenge/seed", { days }),
    entries: (date: string) =>
      adminClient.get<any>(`/admin/daily-challenge/entries?date=${encodeURIComponent(date)}`),
  },

  mysteryBox: {
    listBoxes: () => adminClient.get<any>("/admin/mystery-box"),
    createBox: (data: any) => adminClient.post<any>("/admin/mystery-box", data),
    updateBox: (id: string, data: any) => adminClient.put<any>(`/admin/mystery-box/${id}`, data),
    deleteBox: (id: string) => adminClient.delete<any>(`/admin/mystery-box/${id}`),

    seed: () => adminClient.post<any>("/admin/mystery-box/seed", {}),

    listRewards: (boxId: string) => adminClient.get<any>(`/admin/mystery-box/${boxId}/rewards`),
    createReward: (boxId: string, data: any) =>
      adminClient.post<any>(`/admin/mystery-box/${boxId}/rewards`, data),
    updateReward: (rewardId: string, data: any) =>
      adminClient.put<any>(`/admin/mystery-box/rewards/${rewardId}`, data),
    deleteReward: (rewardId: string) =>
      adminClient.delete<any>(`/admin/mystery-box/rewards/${rewardId}`),
  },
};
