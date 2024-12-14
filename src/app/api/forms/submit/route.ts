/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { forms, submissions } from "@/db/schema";
import { db } from "@/db/db";

export async function POST(req: NextRequest) {
  try {
    const { urlId, responses } = await req.json();

    if (!urlId || !responses || typeof responses !== "object") {
      return NextResponse.json(
        { error: "Invalid request: Form ID and responses are required." },
        { status: 400 }
      );
    }

    const form = await db
      .select()
      .from(forms)
      .where(eq(forms.urlId, urlId))
      .execute()
      .then((res) => res[0]);

    if (!form) {
      console.error("Form not found:", urlId);
      return NextResponse.json({ error: "Form not found." }, { status: 404 });
    }

    // Ensure that responses contain at least one field (email)
    const responseEntries = Object.entries(responses);
    if (responseEntries.length < 1) {
      console.error("Email field missing in responses:", responses);
      return NextResponse.json(
        { error: "Submission requires a valid email field." },
        { status: 400 }
      );
    }

    // Assume email is the first field in responses
    const email = responseEntries[0][1] as string;

    if (!email || typeof email !== "string") {
      console.error("Invalid email in responses:", responses);
      return NextResponse.json(
        { error: "Submission requires a valid email field." },
        { status: 400 }
      );
    }

    // Check for duplicate submissions
    const duplicate = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.formId, form.id), eq(submissions.email, email)))
      .execute()
      .then((res) => res.length > 0);

    if (duplicate) {
      console.error("Duplicate submission for email:", email);
      return NextResponse.json(
        { error: "You have already submitted this form." },
        { status: 400 }
      );
    }

    // Save the submission
    const submissionId = uuidv4();
    await db.insert(submissions).values({
      id: submissionId,
      formId: form.id,
      email,
      responses: JSON.stringify(responses),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Form submitted successfully." });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
