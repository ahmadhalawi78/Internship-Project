import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );

                    supabaseResponse = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    const {
        data: { user },
    } = await supabaseClient.auth.getUser();

    // Protect API routes
    if (
        request.nextUrl.pathname.startsWith("/api/protected") &&
        !user
    ) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // Admin routes
    const isAdminRoute =
        request.nextUrl.pathname.startsWith("/admin") ||
        request.nextUrl.pathname.startsWith("/api/admin");

    if (isAdminRoute) {
        if (!user) {
            if (request.nextUrl.pathname.startsWith("/api/admin")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        const adminEmails = (process.env.ADMIN_EMAILS || "")
            .split(",")
            .map(e => e.trim());

        const isEnvAdmin = user.email && adminEmails.includes(user.email);

        let isDbAdmin = false;
        try {
            const { data: profile } = await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profile?.role === "admin") {
                isDbAdmin = true;
            }
        } catch {
            // ignore
        }

        if (!isEnvAdmin && !isDbAdmin) {
            if (request.nextUrl.pathname.startsWith("/api/admin")) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
