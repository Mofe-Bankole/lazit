import { Keypair } from "@solana/web3.js";
import { db } from "./db";
import { BurnerWalletProps, BurnerWallet } from "./types";

export function createBurnerWallet(props: BurnerWalletProps) {
  // Generates a one time key piar
  const keypair = Keypair.generate();

  const req: BurnerWallet = {
    name: props.name,
    owner: props.owner,
    publicKey: keypair.publicKey.toString(),
    secretKey: Array.from(keypair.secretKey),
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  };

  db.createBurnerWallet(req);

  return req;
}

export function saveBurnerWallet(wallet: BurnerWallet) {
  db.createBurnerWallet(wallet);

  sessionStorage.setItem(wallet.name, JSON.stringify(wallet));
}

export function loadBurnerWallet() {
  const raw = sessionStorage.getItem("burner_wallet");
  return raw ? JSON.parse(raw) : null;
}

export function deleteBurnerWallet(wallet: BurnerWallet) {
  const key = sessionStorage.removeItem(wallet.name);

  // deleting by pub key is the easiest way for now
  db.deleteBurnerWallet(wallet.publicKey);
  alert("Wallet Removed Sucessfully");
}
