"use server";

import { headers } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export async function validateApiKey() {
  try {
    const headersList = await headers();
    const apiKey = headersList.get("x-api-key");

    if (!apiKey) {
      return {
        valid: false,
        error: "API key is required",
        code: "MISSING_API_KEY",
      };
    }

    const expectedApiKey = process.env.INTERNAL_API_KEY;

    if (!expectedApiKey) {
      console.error("INTERNAL_API_KEY not configured in environment");
      return {
        valid: false,
        error: "Server configuration error",
        code: "SERVER_CONFIG_ERROR",
      };
    }

    const apiKeyBuffer = Buffer.from(apiKey);
    const expectedBuffer = Buffer.from(expectedApiKey);

    if (apiKeyBuffer.length !== expectedBuffer.length) {
      return {
        valid: false,
        error: "Invalid API key",
        code: "INVALID_API_KEY",
      };
    }

    const isValid = timingSafeEqual(apiKeyBuffer, expectedBuffer);

    if (!isValid) {
      return {
        valid: false,
        error: "Invalid API key",
        code: "INVALID_API_KEY",
      };
    }

    return { valid: true };
  } catch (error) {
    console.error("API key validation error:", error);
    return {
      valid: false,
      error: "Internal server error",
      code: "VALIDATION_ERROR",
    };
  }
}

export async function createApiToken(payload: Record<string, any>) {
  try {
    const secret = process.env.INTERNAL_API_KEY;
    if (!secret) {
      throw new Error("INTERNAL_API_KEY not configured");
    }

    const timestamp = Date.now();
    const data = {
      ...payload,
      timestamp,
      expires: timestamp + 15 * 60 * 1000, // 15 minutes expiry
    };

    const signature = createHash("sha256")
      .update(JSON.stringify(data) + secret)
      .digest("hex");

    return {
      token: Buffer.from(JSON.stringify(data)).toString("base64"),
      signature,
      expires: data.expires,
    };
  } catch (error) {
    console.error("Error creating API token:", error);
    throw new Error("Failed to create API token");
  }
}

export async function validateApiToken(token: string, signature: string) {
  try {
    const secret = process.env.INTERNAL_API_KEY;
    if (!secret) {
      throw new Error("INTERNAL_API_KEY not configured");
    }

    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    if (Date.now() > decoded.expires) {
      return { valid: false, error: "Token expired", code: "TOKEN_EXPIRED" };
    }

    const expectedSignature = createHash("sha256")
      .update(JSON.stringify(decoded) + secret)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return {
        valid: false,
        error: "Invalid signature",
        code: "INVALID_SIGNATURE",
      };
    }

    const isValid = timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isValid) {
      return {
        valid: false,
        error: "Invalid signature",
        code: "INVALID_SIGNATURE",
      };
    }

    return { valid: true, data: decoded };
  } catch (error) {
    console.error("Error validating API token:", error);
    return { valid: false, error: "Invalid token", code: "INVALID_TOKEN" };
  }
}
