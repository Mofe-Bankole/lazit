import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    publicKey: string;
  };
};

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const paramters = await params
    const publicKey = decodeURIComponent(paramters.publicKey);
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

