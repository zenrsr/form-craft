import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { forms, submissions } from "@/db/schema";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userForms = await db
      .select()
      .from(forms)
      .where(eq(forms.userId, userId));

    const formsWithSubmissions = await Promise.all(
      userForms.map(async (form) => {
        const formSubmissions = await db
          .select()
          .from(submissions)
          .where(eq(submissions.formId, form.id));

        return {
          formId: form.id,
          formTitle: form.title,
          submissions: formSubmissions.map((submission) => ({
            id: submission.id,
            email: submission.email,
            responses:
              typeof submission.responses === "string"
                ? JSON.parse(submission.responses)
                : submission.responses,
            createdAt: submission.createdAt,
          })),
        };
      })
    );

    return NextResponse.json(formsWithSubmissions, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
