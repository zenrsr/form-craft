import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { forms, submissions } from "@/db/schema";
import { db } from "@/db/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Ensure id is accessed asynchronously
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
  }

  try {
    const result = await db
      .select()
      .from(forms)
      .where(eq(forms.id, numericId))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Ensure id is accessed asynchronously
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
  }

  const body = await req.json();
  const { title, description, fields } = body;

  if (!title || !Array.isArray(fields)) {
    return NextResponse.json(
      { error: "Invalid input. Title, description, and fields are required." },
      { status: 400 }
    );
  }

  try {
    await db
      .update(forms)
      .set({
        title,
        description,
        fields: JSON.stringify(fields),
      })
      .where(eq(forms.id, numericId))
      .execute();

    return NextResponse.json(
      { message: "Form updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
  }

  try {
    // First, delete submissions related to the form
    await db
      .delete(submissions)
      .where(eq(submissions.formId, numericId))
      .execute();

    // Then, delete the form itself
    const result = await db
      .delete(forms)
      .where(eq(forms.id, numericId))
      .returning();

    if (result[0].id !== numericId) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Form and associated submissions deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting form and submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
