// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchSession } from "@/lib/supabaseSessionHelper";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Retrieve the session from Supabase
  const session = await fetchSession();

  // Redirect to the login page if no session exists
  if (!session) {
    const path = req.nextUrl.pathname;
    if (
      !path.startsWith("/auth") &&
      !path.startsWith("/share") &&
      path !== "/"
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
