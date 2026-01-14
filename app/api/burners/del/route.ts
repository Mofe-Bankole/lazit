import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both raw string and { publicKey } object payloads
    const publicKey =
      typeof body === "string" ? body : typeof body?.publicKey === "string" ? body.publicKey : null;

    if (!publicKey) {
      return NextResponse.json(
        { success: false, error: "Public key must be supplied" },
        { status: 400 }
      );
    }

    const deleted = db.deleteBurnerWallet(publicKey);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Burner wallet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Burner wallet deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting burner wallet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete burner wallet" },
      { status: 500 }
    );
  }
}
