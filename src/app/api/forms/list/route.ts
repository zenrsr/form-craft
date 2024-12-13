import { db } from "@/db/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allForms = await db
      .select()
      .from(forms)
      .orderBy(desc(forms.createdAt));
    return NextResponse.json(allForms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}
