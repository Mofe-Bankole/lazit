"use client";
import { useWallet } from "@lazorkit/wallet";
import { LogOut } from "lucide-react";

// Connects with a passkey, or disconnects when already connected
export default function ConnectionButton() {
  const { connect, disconnect, isConnected, isConnecting } = useWallet();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        title="Disconnect"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-red-500/30 hover:text-red-300"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Disconnect</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => connect()}
      disabled={isConnecting}
      className="cursor-pointer rounded-lg bg-white px-3.5 py-1.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-60"
    >
      {isConnecting ? "Connecting…" : "Connect"}
    </button>
  );
}
