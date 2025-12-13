"use server";

import { RequestBody } from "@/types/common";

type ApiConfig = {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
};

export class SecureApiService {
  private config: ApiConfig;
  private apiKey: string;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 10000,
      ...config,
    };

    this.apiKey = process.env.EXTERNAL_SERVICE_API_KEY || "";

    if (!this.apiKey) {
      throw new Error("EXTERNAL_SERVICE_API_KEY not configured");
    }
  }

  async request<T = unknown>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      body?: RequestBody;
      headers?: Record<string, string>;
      cache?: RequestCache;
    } = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {}, cache = "no-store" } = options;

    const url = `${this.config.baseURL}${endpoint}`;
    const requestId = this.generateRequestId();

    try {
      const safeBody = body ? this.sanitizeBody(body) : undefined;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
          "X-Request-ID": requestId,
          "X-Timestamp": Date.now().toString(),
          ...this.config.defaultHeaders,
          ...headers,
        },
        body: safeBody ? JSON.stringify(safeBody) : undefined,
        cache,
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as T;

      this.logRequest(requestId, "success", {
        endpoint,
        method,
        status: response.status,
      });

      return data;
    } catch (error) {
      this.logRequest(requestId, "error", {
        endpoint,
        method,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }

  private sanitizeBody(body: RequestBody): RequestBody | undefined {
    const sensitiveFields = [
      "password",
      "creditCard",
      "ssn",
      "apiKey",
      "token",
    ];

    if (typeof body !== "object" || body === null) return body;

    const sanitized = { ...(body as Record<string, unknown>) } as Record<string, unknown>;

    sensitiveFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(sanitized, field)) {
        sanitized[field] = "[REDACTED]";
      }
    });

    return sanitized as RequestBody;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  private logRequest(
    requestId: string,
    status: "success" | "error",
    details: Record<string, unknown>
  ) {
    console.log(`[API Request ${status.toUpperCase()}]`, {
      requestId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }

  async get<T = unknown>(
    endpoint: string,
    options?: {
      headers?: Record<string, string>;
      cache?: RequestCache;
    }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      ...options,
    });
  }

  async post<T = unknown>(
    endpoint: string,
    body: RequestBody,
    options?: {
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
      ...options,
    });
  }
}

export const geocodingService = new SecureApiService({
  baseURL: "https://api.geocoding-service.com/v1",
  defaultHeaders: {
    "User-Agent": "LoopLebanon/1.0",
  },
});

export const paymentService = new SecureApiService({
  baseURL: "https://api.payment-service.com/v1",
  timeout: 30000,
});
