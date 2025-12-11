import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface RecommendationRequest {
  category?: string;
  location?: string;
  userPreferences?: string;
  limit?: number;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: RecommendationRequest = await request.json();
    const { category, location, userPreferences, limit = 5 } = body;

    // Mock listings data (you can replace this with real database query later)
    const mockListings = [
      {
        id: "1",
        title: "Vintage Camera",
        category: "bartering",
        location: "Beirut",
      },
      {
        id: "2",
        title: "Fresh Vegetables",
        category: "food",
        location: "Baabda",
      },
      {
        id: "3",
        title: "Handmade Pottery",
        category: "bartering",
        location: "Jounieh",
      },
      {
        id: "4",
        title: "Homemade Bread",
        category: "food",
        location: "Tripoli",
      },
      { id: "5", title: "Organic Honey", category: "food", location: "Byblos" },
    ];

    const systemPrompt = `You are a helpful community marketplace assistant for Loop Lebanon, 
a platform where neighbors share food and barter items. Analyze the available listings and 
user preferences to provide personalized recommendations. Be concise and friendly.`;

    const userPrompt = `
Available listings:
${JSON.stringify(mockListings, null, 2)}

User preferences: ${userPreferences || "None specified"}
Category filter: ${category || "all"}
Location: ${location || "any"}

Please recommend the top ${limit} listings that would be most relevant to this user. 
Explain briefly why each is a good match. Return your response in JSON format:
{
  "recommendations": [
    {
      "listingId": "id",
      "title": "listing title",
      "reason": "why this is recommended"
    }
  ]
}`;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.5,
          max_tokens: 1024,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!groqResponse.ok) {
      throw new Error("Groq API request failed");
    }

    const data = await groqResponse.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      recommendations: recommendations.recommendations,
      totalListings: mockListings.length,
    });
  } catch (error) {
    console.error("Recommendation API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
