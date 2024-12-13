import { db } from "@/db/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const { title, description, fields } = await req.json();

    if (!title || !fields) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const urlId = nanoid(10);

    const newForm = await db
      .insert(forms)
      .values({ title, description, fields, urlId })
      .returning();

    return NextResponse.json(newForm);
  } catch (error) {
    console.error("Error saving form:", error);
    return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
  }
}
