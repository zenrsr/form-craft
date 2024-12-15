import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://db.ppexrzqmdanzizkgtiyo.supabase.co");
    return NextResponse.json({
      status: response.status,
      message: "Database reachable",
    });
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: "Failed to reach database",
    });
  }
}
