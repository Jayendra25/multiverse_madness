// src/app/api/nasa/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // example response
  return NextResponse.json({ message: "Hello NASA API" });
}

// Agar POST bhi hai
export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ received: body });
}
