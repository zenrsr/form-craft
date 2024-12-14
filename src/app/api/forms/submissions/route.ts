import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { forms, submissions } from "@/db/schema";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  // Check for missing userId
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch forms created by the user
    const userForms = await db
      .select()
      .from(forms)
      .where(eq(forms.userId, userId));

    if (!userForms.length) {
      return NextResponse.json([], { status: 200 }); // No forms found
    }

    console.log("User Forms Fetched:", userForms);

    // Map forms to include their submissions
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

    // Check if any submissions exist
    const hasSubmissions = formsWithSubmissions.some(
      (form) => form.submissions.length > 0
    );

    if (!hasSubmissions) {
      return NextResponse.json(
        { message: "No submissions found" },
        { status: 200 }
      );
    }

    return NextResponse.json(formsWithSubmissions, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);

    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
