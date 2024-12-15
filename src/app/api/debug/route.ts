import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.SUPABASE_JWT_SECRET ? "Loaded" : "Not Loaded",
  });
}
