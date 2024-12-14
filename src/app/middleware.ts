import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Import the correct type for NextRequest
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Retrieve the session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

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
