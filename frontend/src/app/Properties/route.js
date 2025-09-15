import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Call your Render backend API instead of MongoDB
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(
      { message: "Property posted successfully", property: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json(
      { error: "Failed to save property", details: error.message },
      { status: 500 }
    );
  }
}
