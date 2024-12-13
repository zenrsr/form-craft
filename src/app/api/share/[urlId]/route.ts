import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { forms } from "@/db/schema";
import { db } from "@/db/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { urlId: string } }
) {
  const { urlId } = params;

  try {
    const result = await db
      .select()
      .from(forms)
      .where(eq(forms.urlId, urlId))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({ error: "Form not found." }, { status: 404 });
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
