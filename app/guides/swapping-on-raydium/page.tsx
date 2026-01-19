"use client";
import Divider from "../../../components/Divider";
import { JetBrains_Mono } from "next/font/google";
import WalletHeader from "../../../components/WalletHeader";


const jetbrainsMono = JetBrains_Mono({
    weight: ["400", "500", "600"],
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
});

export default function CreatingPasskeyEnabledWallets() {
    function copyCode(text: string) {
        navigator.clipboard.writeText(text);
    }

    return (
        <div className="min-h-screen bg-white text-black relative">
            <WalletHeader />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <a
                    href="/dashboard"
                    className="text-sm text-purple-700 underline"
                >
                    ← Back to dashboard
                </a>
                <div className="mt-7 mb-2.5">
                    <h3 className="text-2xl">Gasless Swaps powered by <span className="text-purple-600">Lazorkit</span> X <span className="text-blue-600">Raydium</span></h3>
                    <Divider />
                </div>
            </div>
        </div>
    )
}