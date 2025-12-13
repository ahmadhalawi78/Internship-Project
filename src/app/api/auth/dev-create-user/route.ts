import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Dev-only helper: create a user and mark email as confirmed.
// WARNING: This route uses the Supabase SERVICE ROLE key and MUST only be
// available in development. Remove or protect before deploying to production.

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { email, password } = body || {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPA_URL || !SUPA_SERVICE_KEY) {
    return NextResponse.json(
      {
        error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL",
      },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(SUPA_URL, SUPA_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  try {
    // admin.createUser marks the user confirmed when email_confirm is true
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    } as any);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
