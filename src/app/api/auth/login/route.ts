import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export async function POST(req: Request) {
  const { email } = await req.json();

  // Validate input
  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  // Generate JWT
  const token = jwt.sign({ email }, JWT_SECRET!, { expiresIn: "7d" });

  // Set HTTP-only cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
