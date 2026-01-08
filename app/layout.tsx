'use client';

import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { LazorkitProvider } from "@lazorkit/wallet";
import config from "@/lib/config";

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

export const CONFIG = {
  RPC_URL: config.SOLANA_RPC_URL,
  PORTAL_URL: config.PORTAL_URL,
  PAYMASTER: { 
    paymasterUrl: config.PAYMASTER_URL 
  }
};  

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={` ${outfit.variable}  ${outfit.className} antialiased`}
      >
        {/* /// Lazorkit Provider */}
        <LazorkitProvider rpcUrl={CONFIG.RPC_URL} portalUrl={CONFIG.PORTAL_URL} paymasterConfig={CONFIG.PAYMASTER}>
          {children}
        </LazorkitProvider>
      </body>
    </html>
  );
}
