"use client";

class SecureApiClient {
  private baseURL: string;
  private apiKey: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;

    if (process.env.NEXT_PUBLIC_API_KEY) {
      console.warn(
        "WARNING: API key exposed client-side. Use server actions instead."
      );
      this.apiKey = process.env.NEXT_PUBLIC_API_KEY;
    }
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers(options.headers);

    if (this.apiKey) {
      headers.set("x-api-key", this.apiKey);
    }

    headers.set("x-request-id", this.generateRequestId());

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
      credentials: "same-origin",
    });

    if (!response.ok) {
      const parsed = await response
        .json()
        .catch(() => ({ error: "Unknown error" } as { error: string }));
      throw new Error((parsed as { error?: string }).error || `API Error: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  private generateRequestId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export async function secureFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const apiClient = new SecureApiClient(
  process.env.NEXT_PUBLIC_API_URL || ""
);
