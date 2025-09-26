import { NextRequest, NextResponse } from "next/server";

// Minimal GET handler to make it a valid module
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "API working" });
}
