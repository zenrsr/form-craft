// src/app/api/forms/list/route.ts

import { db } from "@/db/db";
import { forms, submissions } from "@/db/schema";
import { fetchSession } from "@/lib/supabaseSessionHelper";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await fetchSession();
  if (!session) {
    console.error("No user session found.");
    return NextResponse.json(
      { error: "No user session found" },
      { status: 401 }
    );
  }

  try {
    // Fetch user forms
    const userForms = await db
      .select({
        id: forms.id,
        title: forms.title,
        description: forms.description,
        urlId: forms.urlId,
        createdAt: forms.createdAt,
        submissionCount: sql<number>`COUNT(${submissions.id})`,
        fields: forms.fields,
      })
      .from(forms)
      .leftJoin(submissions, eq(forms.id, submissions.formId))
      .where(eq(forms.userId, session.id))
      .groupBy(
        forms.id,
        forms.title,
        forms.description,
        forms.urlId,
        forms.createdAt,
        forms.fields
      )
      .orderBy(desc(forms.createdAt));

    return NextResponse.json(userForms);
  } catch (dbError) {
    console.error("Error fetching forms:", dbError);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}
