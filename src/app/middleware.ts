import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export async function middleware(req: NextRequest) {
  const unprotectedPaths = ["/auth/signup", "/auth/login", "/share", "/"];
  const path = req.nextUrl.pathname;

  // Allow unprotected routes
  if (
    unprotectedPaths.some((unprotectedPath) => path.startsWith(unprotectedPath))
  ) {
    return NextResponse.next();
  }

  const authToken = req.cookies.get("auth-token")?.value;

  if (!authToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    jwt.verify(authToken, JWT_SECRET!);
  } catch (err) {
    console.error("Invalid JWT:", err);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
