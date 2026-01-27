/**
 * Centralized API Client
 * Provides type-safe API calls with consistent error handling
 * Inspired by VickyJay API integration patterns
 */

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends Omit<RequestInit, "body"> {
  method?: RequestMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  requireAuth?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClientError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Get the base URL for API requests
 * Since API is in the same codebase, always use relative paths
 */
function getBaseUrl(): string {
  // Always use relative paths - works for both client and server-side
  return "";
}

/**
 * Get authentication token
 * Checks admin token first, then user token
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Try to get admin token first (from sessionStorage)
  const adminToken = sessionStorage.getItem("admin_token");
  if (adminToken) return adminToken;

  // Try to get user token (from localStorage)
  const userToken = localStorage.getItem("auth_token");
  return userToken;
}

/**
 * Build query string from params object
 */
function buildQueryString(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const searchParams = new URLSearchParams();

  // Optimized: single pass with early return
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Parse response and handle errors
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  let data: unknown;

  try {
    if (isJson) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }
  } catch (error) {
    throw new ApiClientError(
      "Failed to parse response",
      response.status,
      "PARSE_ERROR"
    );
  }

  if (!response.ok) {
    const errorData = data as {
      error?: string;
      message?: string;
      code?: string;
    };
    throw new ApiClientError(
      errorData.error ||
        errorData.message ||
        `Request failed with status ${response.status}`,
      response.status,
      errorData.code || "API_ERROR"
    );
  }

  return data as T;
}

/**
 * Main API client function
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    requireAuth = false,
    headers = {},
    ...fetchOptions
  } = options;

  // Build URL
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}${params ? buildQueryString(params) : ""}`;

  // Prepare headers
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add authentication token if required
  // For logout, we still send token if available (for activity logging) but don't require it
  if (requireAuth || endpoint === "/api/auth/logout") {
    const token = getAuthToken();
    if (token) {
      (requestHeaders as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    } else if (requireAuth && endpoint !== "/api/auth/logout") {
      // If auth is required but no token found, throw error
      throw new ApiClientError(
        "Authentication required. Please log in.",
        401,
        "AUTH_REQUIRED"
      );
    }
  }

  // Prepare request body
  let requestBody: string | undefined;
  if (body !== undefined) {
    if (typeof body === "string") {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      ...fetchOptions,
    });

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Detect Bun SSL errors and provide helpful error message
    const errorMessage = error instanceof Error ? error.message : "Network request failed";
    const isBunSslError = 
      errorMessage.includes("ERR_SSL_SSLV3_ALERT_BAD_RECORD_MAC") ||
      errorMessage.includes("sslv3 alert bad record mac") ||
      (error instanceof Error && 
       'code' in error && 
       error.code === 'ERR_SSL_SSLV3_ALERT_BAD_RECORD_MAC');

    if (isBunSslError) {
      throw new ApiClientError(
        "SSL/TLS connection error. This may be a Bun-specific issue. Try: 1) Restarting the dev server, 2) Checking your network connection, 3) Updating Bun to the latest version.",
        undefined,
        "SSL_ERROR"
      );
    }

    // Network or other errors
    throw new ApiClientError(
      errorMessage,
      undefined,
      "NETWORK_ERROR"
    );
  }
}

/**
 * Convenience methods for each HTTP verb
 */
export const api = {
  get: <T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) => apiClient<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) => apiClient<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) => apiClient<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};

export { ApiClientError };
export type { RequestOptions, ApiError };
