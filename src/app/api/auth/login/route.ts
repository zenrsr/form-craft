// src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { data } = await req.json();

  const { session } = data;

  if (session) {
    const response = NextResponse.json({ success: true });

    // Set the auth cookie in the response
    response.cookies.set({
      name: `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}-auth-token`,
      value: session.access_token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  }

  return NextResponse.json({ error: "No session found." }, { status: 401 });
}
