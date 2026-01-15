import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import config from "./config";
import { SOLANA_DEVNET_RPC, USDC_MINT } from "./constants";

export function createConnection() {
  return new Connection(
    config.SOLANA_RPC_URL || SOLANA_DEVNET_RPC,
    "confirmed"
  );
}

export async function getSolBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const lamports = await connection.getBalance(publicKey);
  return lamports / LAMPORTS_PER_SOL;
}

export async function getUsdcBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  try {
    const tokenAccount = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
    const accountInfo = await connection.getAccountInfo(tokenAccount);

    if (!accountInfo) {
      return 0;
    }

    // Token account layout: mint (32) + owner (32) + amount (8)
    const amount = Number(accountInfo.data.readBigUInt64LE(64));
    // USDC has 6 decimals
    return amount / 1_000_000;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function getBalances(
  connection: Connection,
  publicKey: PublicKey
): Promise<{ sol: number; usdc: number }> {
  const [sol, usdc] = await Promise.all([
    getSolBalance(connection, publicKey),
    getUsdcBalance(connection, publicKey),
  ]);

  return { sol, usdc };
}
