import { NextRequest, NextResponse } from "next/server";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { db } from "../../../../lib/db";
import { createConnection } from "../../../../lib/solana";

// Signs the sweep on the server so burner secret keys never reach the browser.
export async function POST(request: NextRequest) {
  try {
    const { publicKey, recipient, amount } = await request.json();

    const wallet = typeof publicKey === "string" ? db.getBurnerWallet(publicKey) : null;
    if (!wallet) {
      return NextResponse.json({ success: false, error: "Burner wallet not found" }, { status: 404 });
    }

    let to: PublicKey;
    try {
      to = new PublicKey(recipient);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid recipient address" }, { status: 400 });
    }

    const lamports = Math.round(parseFloat(amount) * LAMPORTS_PER_SOL);
    if (!Number.isFinite(lamports) || lamports <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }

    const signer = Keypair.fromSecretKey(Uint8Array.from(wallet.secretKey));
    const tx = new Transaction().add(
      SystemProgram.transfer({ fromPubkey: signer.publicKey, toPubkey: to, lamports })
    );
    const signature = await sendAndConfirmTransaction(createConnection(), tx, [signer]);

    return NextResponse.json({ success: true, signature }, { status: 200 });
  } catch (error) {
    console.error("Error sweeping burner wallet:", error);
    return NextResponse.json({ success: false, error: `${error}` }, { status: 500 });
  }
}
