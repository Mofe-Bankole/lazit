"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { copyToClipboard } from "../lib/clipboard";

// Shows the short wallet address; clicking copies the full address
export default function AddressButton() {
  const { vaultPubkey } = useWallet();
  const [copied, setCopied] = useState(false);
  const full = vaultPubkey?.toString();
  if (!full) return null;

  function copy() {
    copyToClipboard(full as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      title="Copy address"
      className="hidden cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:bg-white/10 sm:inline-flex"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {full.slice(0, 4)}…{full.slice(-4)}
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-500" />}
    </button>
  );
}
