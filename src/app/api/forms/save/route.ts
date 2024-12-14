// src/app/api/forms/save/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db/db";
import { forms } from "@/db/schema";
import { fetchSession } from "@/lib/supabaseSessionHelper";

export async function POST(req: Request) {
  try {
    // Retrieve the cookies
    const cookieStore = await cookies();

    // Get the Supabase auth token directly
    const authToken = cookieStore.get(
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}-auth-token`
    )?.value;

    if (!authToken) {
      console.error("Auth token not found in cookies");
      return NextResponse.json(
        { error: "Unauthorized: Auth token not found" },
        { status: 401 }
      );
    }

    const session = await fetchSession();

    if (!session) {
      console.error("Session Error in POST API:");
      return NextResponse.json(
        { error: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    // Parse request body
    const { title, description, fields } = await req.json();

    if (!title || !fields) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Get the user ID from the session
    const userId = session.id;

    // Save the form in the database
    const newForm = await db.insert(forms).values({
      title,
      description,
      fields,
      userId,
    });

    return NextResponse.json({ success: true, form: newForm });
  } catch (error) {
    console.error("Error saving form:", error);
    return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
  }
}
