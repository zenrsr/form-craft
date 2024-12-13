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

    // Extract the ID portion from combined keys
    const extractFieldId = (key: string) => key.split("_")[0];

    // Create a map of form fields for efficient lookup by ID
    const fieldsMap = Object.fromEntries(
      form.fields.map((field: any) => [field.id, field])
    );

    // Find the email field in the responses
    const emailField = Object.entries(responses).find(([key, value]) => {
      const fieldId = extractFieldId(key); // Extract the original field ID
      const field = fieldsMap[fieldId]; // Get the corresponding field
      return field?.type === "email" && value; // Check if it's an email field with a value
    });

    if (!emailField) {
      console.error("Email field not found. Responses:", responses);
      console.error("Form Fields:", form.fields);
      return NextResponse.json(
        { error: "Submission requires a valid email field." },
        { status: 400 }
      );
    }

    const email = emailField[1] as string; // Extract the email value

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
