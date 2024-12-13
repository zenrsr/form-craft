import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { forms, submissions } from "@/db/schema";

export async function GET() {
  try {
    // Fetch all forms
    const allForms = await db.select().from(forms);

    // Fetch submissions for each form
    const formsWithSubmissions = await Promise.all(
      allForms.map(async (form) => {
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
                : submission.responses, // Safely parse JSON
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
