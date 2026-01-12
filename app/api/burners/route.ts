import { db } from "@/lib/db";
import { createBurnerWallet, type BurnerWalletProps } from "@/lib/burner";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const wallets = db.getAllBurnerWallets();
    // Don't send secretKeys to client for security
    const safeWallets = wallets.map(({ secretKey, ...wallet }) => wallet);
    return NextResponse.json(
      { success: true, wallets: safeWallets, timestamp: Date.now() },
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
    
    // Don't send secretKey to client for security
    const { secretKey, ...safeWallet } = wallet;
    
    return NextResponse.json(
      { success: true, wallet: safeWallet, timestamp: Date.now() },
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
