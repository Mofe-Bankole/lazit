"use client";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black relative --font-outfit">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/dashboard"> 👈 Back</a>
        <h2 className="md:text-3xl text-[20.7px] mb-6 mt-1.5">
            Triggering Gasless Transactions with Lazorkit
        </h2>
        <p className="mb-1.5">
        This guide assumes you have finished the <a href="/guides/creating-wallets">Creating Passkey-Based Wallets with Lazorkit</a> guide
        </p>
      </div>
    </div>
  );
}
