const API_BASE = "https://d1on9no3gzssbx.cloudfront.net";

type CacheEntry<T = any> = {
  timestamp: number;    // when stored in memory cache
  data: T;
  fetchedAt: string;    // formatted time label
};

const memoryCache = new Map<string, CacheEntry>();

const LS_PREFIX = "weather_cache:";
const CACHE_TTL = 5 * 60 * 1000; // 5 min
const LS_TTL = 60 * 60 * 1000;   // 1 hour

let lastFetchTime: string | null = null;
export function getLastFetchTime() {
  return lastFetchTime;
}

// Custom error for 400/500

export class ApiError extends Error {
  status: number;
  payload?: any;

  constructor(status: number, message: string, payload?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError() {
    return this.status >= 500;
  }
}

// LocalStorage helpers

function saveToLocalStorage(path: string, data: any, fetchedAtMs: number) {
  try {
    localStorage.setItem(
      `${LS_PREFIX}${path}`,
      JSON.stringify({
        savedAt: fetchedAtMs,
        data,
      })
    );
  } catch (e) {
    console.warn("LocalStorage save failed", e);
  }
}

export function loadOfflineCache(path: string) {
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}${path}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { savedAt: number; data: any };

    if (Date.now() - parsed.savedAt > LS_TTL) return null;

    return parsed;
  } catch {
    return null;
  }
}

async function parseErrorBody(
  res: Response
): Promise<{ message: string; payload: any }> {
  try {
    const text = await res.text();
    if (!text) {
      return {
        message: res.statusText || "Request failed",
        payload: null,
      };
    }

    try {
      const json = JSON.parse(text);
      const msg =
        json.message ||
        json.error ||
        json.detail ||
        res.statusText ||
        "Request failed";

      return { message: msg, payload: json };
    } catch {
      return {
        message: text || res.statusText || "Request failed",
        payload: text,
      };
    }
  } catch {
    return {
      message: res.statusText || "Request failed",
      payload: null,
    };
  }
}

export async function get<T>(path: string): Promise<T> {
  const now = Date.now();

  // memory cache
  const cached = memoryCache.get(path);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    lastFetchTime = cached.fetchedAt; // reuse previous time label
    return cached.data as T;
  }

  const url = `${API_BASE}${path}`;

  try {
    const res = await fetch(url);

    // success
    if (res.ok) {
      const json = (await res.json()) as T;

      const fetchedAtMs = Date.now();
      const fetchedAtLabel = new Date(fetchedAtMs).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      );

      lastFetchTime = fetchedAtLabel;

      memoryCache.set(path, {
        timestamp: now,
        data: json,
        fetchedAt: fetchedAtLabel,
      });
      saveToLocalStorage(path, json, fetchedAtMs);

      return json;
    }

    // 4xx – client error: NO offline fallback
    if (res.status >= 400 && res.status < 500) {
      const { message, payload } = await parseErrorBody(res);
      throw new ApiError(res.status, message, payload);
    }

    // 5xx – server error: try offline, else throw
    const { message, payload } = await parseErrorBody(res);
    console.error("Server error:", res.status, message);

    const offline = loadOfflineCache(path);
    if (offline) {
      lastFetchTime = new Date(offline.savedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return offline.data as T;
    }

    throw new ApiError(res.status, message, payload);
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }

    // Network / unexpected error - try offline
    console.error("Network or unexpected error for GET", path, err);

    const offline = loadOfflineCache(path);
    if (offline) {
      lastFetchTime = new Date(offline.savedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return offline.data as T;
    }

    throw new ApiError(
      0,
      "Network error. Please check your connection.",
      err
    );
  }
}

export async function post<T>(path: string, body: any): Promise<T> {
  const url = `${API_BASE}${path}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return (await res.json()) as T;
    }

    const { message, payload } = await parseErrorBody(res);
    throw new ApiError(res.status, message, payload);
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, "Network error. Please try again.", err);
  }
}
