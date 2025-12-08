import { NextResponse, NextRequest } from "next/server";
import { validateApiKey } from "@/app/actions/security";

export async function apiProtectionMiddleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const publicRoutes = ["/api/auth", "/api/health", "/api/public"];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const validation = await validateApiKey();

  if (!validation.valid) {
    return NextResponse.json(
      {
        error: validation.error,
        code: validation.code,
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": "ApiKey",
        },
      }
    );
  }

  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  response.headers.set("X-RateLimit-Limit", "100");
  response.headers.set("X-RateLimit-Remaining", "99");
  response.headers.set("X-RateLimit-Reset", String(Date.now() + 3600000));

  return response;
}
