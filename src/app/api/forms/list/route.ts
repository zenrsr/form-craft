import { db } from "@/db/db";
import { forms } from "@/db/schema";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Session from api/forms/list:", session);

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, session.session?.user.id))
    .orderBy(desc(forms.createdAt));

  console.log("User Forms Fetched from backend:", userForms);

  return NextResponse.json(userForms);
}
