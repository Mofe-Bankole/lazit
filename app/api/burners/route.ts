
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../lib/db";
import { BurnerWalletProps } from "../../../lib/types";
import { createBurnerWallet, toPublicBurner } from "../../../lib/burner";

export async function GET(request: NextRequest) {
  try {
    // Only return the caller's burners, and never their secret keys
    const owner = request.nextUrl.searchParams.get("owner");
    const wallets = owner
      ? db.getAllBurnerWallets().filter((w) => w.owner === owner).map(toPublicBurner)
      : [];
    return NextResponse.json(
      { success: true, wallets, timestamp: Date.now() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching burner wallets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch burner wallets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BurnerWalletProps = await request.json();
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Wallet name is required" },
        { status: 400 }
      );
    }
    
    const wallet = createBurnerWallet({
      name: body.name.trim(),
      owner : body.owner.trim()
    });
  
    
    return NextResponse.json(
      { success: true, wallet: toPublicBurner(wallet), timestamp: Date.now() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating burner wallet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create burner wallet" },
      { status: 500 }
    );
  }
}
