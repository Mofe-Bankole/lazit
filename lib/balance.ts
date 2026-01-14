import { Connection, useWallet } from "@lazorkit/wallet";
import config from "./config";
import { SOLANA_DEVNET_RPC } from "./constants";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(
    config?.SOLANA_RPC_URL || SOLANA_DEVNET_RPC,
    "confirmed"
  );

export async function fetchSOLBalance(){
    const {smartWalletPubkey} = useWallet()
    if (!smartWalletPubkey) return;

    try {
        const lamports = await connection.getBalance(smartWalletPubkey);
        let balance = lamports / LAMPORTS_PER_SOL
        return balance
    } catch (error) {
        alert("Error Fetching Balances")
    }
}