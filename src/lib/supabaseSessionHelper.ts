import { headers } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF!;

export async function fetchSession() {
  // Resolve the headers and get the cookie string
  const headerStore = await headers();
  const cookieStore = headerStore.get("cookie");

  // Extract the access token from the cookies
  const tokenCookieName = `sb-${PROJECT_REF}-auth-token`;
  const cookies = Object.fromEntries(
    cookieStore?.split("; ").map((c) => c.split("=")) || []
  );
  const accessToken = cookies[tokenCookieName];

  if (!accessToken) {
    console.error("No auth token found in cookies.");
    return null;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apiKey: SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch session:", response.statusText);
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}
