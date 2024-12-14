import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { db } from "@/db/db";
import { forms } from "@/db/schema";

export async function POST(req: Request) {
  try {
    // Await the cookies to ensure they are properly resolved
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!session || error) {
      console.error("Session Error:", error);
      return NextResponse.json(
        { error: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    const { title, description, fields } = await req.json();

    if (!title || !description || !fields) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const userId = session.user.id;

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
