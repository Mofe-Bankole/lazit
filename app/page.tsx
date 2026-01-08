"use client";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@lazorkit/wallet";
import Link from "next/link";

export default function Home() {
  // Apps main page

  const Xlink = "https://x.com/Mofe_bnks";

  const { wallet } = useWallet();

  return (
    <div className="h-full flex items-center justify">
      <div className="w-1/2 px-3 bg-black">
        <div className="w-full">
          {!wallet && (
            <div className="w-full mx-auto rounded-sm justify-between flex mt-4">
              <h4>Lazit</h4>
              <p>
                made with ♥️ by{" "}
                <Link href={Xlink} className="" target="_blank">
                  Mofe_bnks
                </Link>
              </p>
            </div>
          )}
        </div>

        <WalletConnect />
      </div>
      <div className="w-1/2 bg-white text-black justify-between">
        <div className="min-h-screen text-black flex flex-col justify-center px-3">
          <h1 className="mb-3 text-3xl">Lazit</h1>
          <h3>
            Totally , rad wallet that doesnt require you (yes you 🫵) to keep a
            seed phrase in some paper
          </h3>
          <h4>You dont need a seed phrase before you can make transactions</h4>
          <h4>Lazit is proof of that</h4>
          <div className="grid grid-cols-2 grid-rows-2 feature-container gap-3 mt-6">
            <div className="flex border border-gray-300 px-1.5 py-4 rounded-sm cursor-pointer">
              Passkey-enabled Wallet
            </div>
            <div className="flex border border-gray-300 px-1.5 py-4 rounded-sm cursor-pointer">
              Integration Guides
            </div>
            <div className="flex border border-gray-300 px-1.5 py-4 rounded-sm cursor-pointer">
              Wallet Sweeping Management
            </div>
            <div className="flex border border-gray-300 px-1.5 py-4 rounded-sm cursor-pointer">
              Feature
            </div>
          </div>
        </div>
        <p className="bg-black text-white px-3 text-center h-[2%]">
          Powered by{" "}
          <a
            href="https://lazorkit.com/"
            className="text-[#7857FF] contrast-4.55"
            target="_blank"
          >
            lazorkit
          </a>
        </p>
      </div>
    </div>
  );
}
