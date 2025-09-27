// src/app/api/nasa/route.ts
import { NextResponse } from "next/server";

// GET request handler
export async function GET() {
  return NextResponse.json({ message: "Hello from NASA API" });
}

// Optional POST handler
export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({ received: data });
}
