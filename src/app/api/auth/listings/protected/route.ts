import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, createApiToken } from "@/app/actions/security";
import { supabaseServer } from "@/backend/lib/supabase/server";

// Utility function to sanitize user input
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>"'`]/g, "")
    .trim();
}

// GET handler – fetch listings
export async function GET(request: NextRequest) {
  try {
    const validation = await validateApiKey();

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, code: validation.code },
        { status: 401 }
      );
    }

    const clientId = request.headers.get("x-client-id") ?? undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required", code: "MISSING_CLIENT_ID" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();
    const { data: listings, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch listings", code: "DATABASE_ERROR" },
        { status: 500 }
      );
    }

    const token = await createApiToken({
      clientId,
      permissions: ["read:listings"],
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        data: listings ?? [],
        token: token.token,
        signature: token.signature,
        expires: token.expires,
        metadata: {
          count: listings?.length ?? 0,
          timestamp: new Date().toISOString(),
          clientId,
        },
      },
      {
        headers: {
          "Cache-Control": "private, max-age=60",
          "X-API-Version": "1.0",
        },
      }
    );
  } catch (error) {
    console.error("Protected API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        requestId: `req_${Date.now()}`,
      },
      { status: 500 }
    );
  }
}

// Define expected shape for POST request body
interface ListingBody {
  title: string;
  description: string;
  category: string;
  location: string;
  user_id?: string;
}

// POST handler – create a new listing
export async function POST(request: NextRequest) {
  try {
    const validation = await validateApiKey();

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, code: validation.code },
        { status: 401 }
      );
    }

    const body: ListingBody = await request.json();

    const requiredFields: (keyof ListingBody)[] = [
      "title",
      "description",
      "category",
      "location",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
          code: "VALIDATION_ERROR",
          missingFields,
        },
        { status: 400 }
      );
    }

    const sanitizedData = {
      title: sanitizeInput(body.title),
      description: sanitizeInput(body.description),
      category: body.category,
      location: body.location,
      user_id: body.user_id,
      created_at: new Date().toISOString(),
    };

    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("listings")
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create listing", code: "DATABASE_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Listing created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
