import { db } from "@/db/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const authHeader = await req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded !== "object" || !decoded.sub) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.sub;

    const { title, description, fields } = await req.json();

    // Insert form into the database
    await db.insert(forms).values({
      title,
      description,
      fields,
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving form:", error);
    return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
  }
}
