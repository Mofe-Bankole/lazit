"use client";
import { useBalance } from "@/hooks/useBalances";
import { useTransfer } from "@/hooks/useTransfer";
import { useWallet } from "@lazorkit/wallet";
import React, { useState } from "react";
import AddressButton from "../../components/AddressButton";
import Divider from "../../components/Divider";
import WalletHeader from "../../components/WalletHeader";

export default function Dashboard() {
  // As at time of writing , lazit is only on devnet
  const { isSigning, smartWalletPubkey, isConnected } =
    useWallet();
  const sender = smartWalletPubkey?.toString() as string;
  const { fetchBalances, SolBalance, UsdcBalance, loading } = useBalance(isConnected ? smartWalletPubkey : null)
  const [recipient, setRecipient] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const { 
    handleTransactions, 
    status, 
    explorerUrl, 
    error: txError,
    signature,
    amount: txAmount
  } = useTransfer({ recipient, amount, sender });

  // Function to handle sending transaction


  return (
    <div className="min-h-screen bg-white text-black relative ">
      <WalletHeader />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Account Info */}
        <div className="mb-8 pb-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
              <span className="text-sm text-gray-600">
                {" "}
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <AddressButton />
          </div>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className="border border-gray-300 p-4 cursor-pointer"
            onClick={fetchBalances}
          >
            <div className="">
              <div className="text-xs text-gray-500 mb-1">SOL</div>
              <div className="text-lg font-medium">
                {loading ? (
                  <span className="text-gray-400">--</span>
                ) : (
                  `${SolBalance?.toFixed(4) || "0.0000"} SOL`
                )}
              </div>
              <div></div>
            </div>
          </div>
          <div
            className="border border-gray-300 p-4 cursor-pointer relative"
            onClick={fetchBalances}
          >
            {/* <div className="absolute top-0 right-0 w-6 h-6 bg-gray-300   "></div> */}
            <div className="text-xs text-gray-500 mb-1">USDC</div>
            <div className="text-lg font-medium">
              {loading ? (
                <span className="text-gray-400">--</span>
              ) : (
                `${UsdcBalance?.toFixed(2) || "0.00"} USDC`
              )}
            </div>
          </div>
        </div>
        <div className="mt-2.5 md:grid md:grid-cols-3 grid-rows-1 items-center gap-1 mb-2">
          <a className="cursor-pointer rounded-sm border border-gray-300 text-black" href="/examples/burner-wallets">
            <div className="py-2 px-3.5 cursor-pointer relative flex flex-col mb-1.5">
              <h6 className="mb-3 ">
                Burner Wallets
              </h6>
              <p className="text-sm text-gray-500">Temporary wallets for frictionless onboarding </p>
            </div>
          </a>
          <a className="cursor-pointer rounded-sm border border-gray-300 text-black" href="/examples/raydium-swaps">
            <div className="py-2 px-3.5 cursor-pointer relative flex flex-col mb-1.5">
              <h6 className="mb-3 ">
                Raydium Swaps
              </h6>
              <p className="text-sm text-gray-500">Swap Tokens on Raydium Devnet</p>
            </div>
          </a>
          <a className="cursor-pointer rounded-sm border border-gray-300 text-black" href="/examples/gasless-by-kora">
            <div className="py-2 px-3.5 cursor-pointer relative flex flex-col mb-1.5">
              <h6 className="mb-3 ">
                Gasless Transfers
              </h6>
              <p className="text-sm text-gray-500">Send SOL but without paying gas fees 👌</p>
            </div>
          </a>
        </div>
        <Divider />
        <h3 className="text-xl mt-1">Integration Guides</h3>
        <div className="mt-2.5 md:grid md:grid-cols-3 grid-rows-1 items-center gap-1 mb-2">
          <a className="cursor-pointer rounded-sm border border-gray-300 text-black" href="/guides/creating-wallets">
            <div className="py-2 px-3.5 cursor-pointer relative flex flex-col mb-1.5">
              <h6 className="mb-3 ">
                Creating Passkey-Based Wallets with Lazorkit
              </h6>
              <p className="text-sm text-gray-500">Learn how to add Lazorkit wallets to your app</p>
            </div>
          </a>
          <a className="cursor-pointer rounded-sm border border-gray-300 text-black" href="/guides/triggering-gasless-txns">
            <div className="py-2 px-3.5 cursor-pointer relative flex flex-col mb-1.5">
              <h6 className="mb-3 ">
                Triggering Gasless Transactions sponsored by Kora
              </h6>
              <p className="text-sm text-gray-500">Gasless Transactions are just the beginning... </p>
            </div>
          </a>
        </div>
        {/* Send Form */}
        <div className="border border-gray-200 p-6 mt-1.5">
          <div className="mb-6">
            <label
              className="block text-sm text-gray-700 mb-2"
              htmlFor="recipient"
            >
              Recipient Address
            </label>
            <input
              id="recipient"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 text-sm font-mono focus:outline-none focus:border-black"
              placeholder="Enter Solana address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm text-gray-700 mb-2 text-right"
              htmlFor="amount"
            >
              Amount (SOL)
            </label>
            <span>{txError}</span>
            <input
              id="amount"
              type="number"
              step="0.0001"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleTransactions}
            disabled={!recipient || !amount || isSigning || !isConnected || loading || status === "pending"}
          >
            {status === "pending" ? "Sending..." : "Send"}
          </button>
          {status === "success" && (
            <div className="mt-5 text-sm md:text-center text-green-600">
              <p>Transaction Successful!</p>
              {explorerUrl && (
                <p className="mt-2">
                  View Transaction:{" "}
                  <a 
                    href={explorerUrl} 
                    className="cursor-pointer underline hover:text-green-700" 
                    target="_blank"
                  >
                    {explorerUrl}
                  </a>
                </p>
              )}
              {signature && (
                <p className="mt-1 text-xs text-gray-500 font-mono">
                  Signature: {signature}
                </p>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 text-sm text-red-600">
              {txError || "Transaction failed"}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
