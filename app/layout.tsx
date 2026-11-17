'use client';

import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { LazorkitProvider } from "@lazorkit/wallet";
import { Buffer } from "buffer";
import config from "../lib/config";

// @lazorkit/wallet 3.x no longer sets a global Buffer; Raydium/web3 code here still needs one
if (typeof window !== "undefined") {
  (window as any).Buffer ??= Buffer;
}

const outfit = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Empty env vars fall back to the SDK defaults: devnet RPC, portal.lazor.sh and
// LazorKit's devnet Kora relayer (set up for protocol v2)
export const CONFIG = {
  RPC_URL: config.SOLANA_RPC_URL || undefined,
  PORTAL_URL: config.PORTAL_URL || undefined,
  PAYMASTER: config.PAYMASTER_URL ? { paymasterUrl: config.PAYMASTER_URL } : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} ${outfit.className} antialiased`}
      >
        {/* /// Lazorkit Provider */}
        {/* cluster: keyed RPC URLs don't name a cluster, and anything unrecognised is taken as mainnet */}
        <LazorkitProvider
          rpcUrl={CONFIG.RPC_URL}
          portalUrl={CONFIG.PORTAL_URL}
          paymasterConfig={CONFIG.PAYMASTER}
          cluster="devnet"
        >
          {children}
        </LazorkitProvider>
      </body>
    </html>
  );
}
