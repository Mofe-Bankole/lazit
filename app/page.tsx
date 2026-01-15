"use client";
import WalletConnect from "../components/WalletConnect";
import { useWallet } from "@lazorkit/wallet";
import Link from "next/link";

export default function Home() {
  const Xlink = "https://x.com/Mofe_bnks";
  const { wallet, connect, isConnecting } = useWallet();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/2 w-full px-3 md:py-0 py-2 bg-black hidden md:flex flex-col justify-center">
        <div className="w-full">
          {!wallet && (
            <div className="w-full mx-auto rounded-sm justify-between flex mt-2">
              <h4 className="text-white">Lazit</h4>
              <p className="text-white">
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
      {/* Right Side */}
      <div className="md:w-1/2 w-full bg-white text-black flex flex-col justify-between min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-3 py-6">
          <h1 className="mb-3 text-3xl">Lazit</h1>
          <h3 className="mb-3">
            Lazit: The next-generation wallet designed so you never have to write down or remember a seed phrase.
          </h3>
          <h4 className="mb-2">No seed phrase hassle. Just secure, seamless access to your crypto.</h4>
          <h4 className="mb-2">Lazit uses passkey technology to make wallet management simpler and safer.</h4>
          <h5 className="mt-2">
            Try it out and experience passwordless, seedless crypto for yourself!
          </h5>
          <div className="md:grid hidden grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
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
          <button
            className="md:hidden mt-3 px-6 py-2 rounded-lg bg-black text-slate-100 cursor-pointer shadow-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-lg"
            onClick={() => connect()}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>

        </div>
        <p className="bg-black text-white px-3 text-center py-2">
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
