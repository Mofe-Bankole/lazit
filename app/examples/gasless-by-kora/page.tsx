"use client";
import useBalance from "@/hooks/useBalances";
import WalletHeader from "../../../components/WalletHeader";
import config from "../../../lib/config";
import { SOLANA_DEVNET_RPC } from "../../../lib/constants";
import { useWallet } from "@lazorkit/wallet"
import { Connection } from "@solana/web3.js"
import React, { useState } from "react";

export default function GaslessTransfers() {
    
    const { smartWalletPubkey, isConnected
        , isSigning
    } = useWallet();
    const { SolBalance, fetchBalances, UsdcBalance, loading } = useBalance(isConnected ? smartWalletPubkey : null);
    const [recipient, setRecipient] = React.useState<string>("");
    const [amount, setAmount] = React.useState<string>("");
    const [txnsig, setTxnSig] = useState("");
    const [txError, setTxError] = React.useState<string>("");
    const [txStatus, setTxStatus] = React.useState<"idle" | "success" | "error">(
        "idle"
    );

    return (
        <div className="min-h-screen bg-white text-black relative">
            <WalletHeader />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="space-y-4 text-normal">
                    <p>So how exactly does Lazorkit do <span className="font-bold text-purple-500 contrast-75">Gasless Transactions ?</span></p>
                    <p className="">Thats all thanks to <a href="https://launch.solana.com/products/kora" className="text-[#483939f2]" target="_blank">Kora</a>. <br />Kora is a solana signing structure that handles gas fees without removing as much as a cent from users accounts</p>
                    <p>Users can also pay fees in USDC, BONK or in your apps native token </p>
                </div>
                <h1 className=" my-3 text-2xl">Send Sol to well...whoever without paying gas fees</h1>
            {isConnected ? <div className="border border-gray-200 p-6 mt-10">
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
                        // onClick={handleTransaction}
                        disabled={!recipient || !amount || isSigning || loading}
                    >
                        {isSigning ? "Sending..." : "Send ✈️"}
                    </button>

                    {txStatus === "success" && (
                        <div className="mt-5 text-sm text-center text-green-600">
                            Transaction Successful :   <p>  {txStatus === "success" ? `View Transaction : ` : ""}  {txStatus === "success" ? <a href={`https://solscan.io/tx/${txnsig}?cluster=devnet`} className="cursor-pointer">{`https://solscan.io/tx/${txnsig}?cluster=devnet`}</a> : ""}</p>
                        </div>
                    )}
                    {txStatus === "error" && (
                        <div className="mt-4 text-sm text-red-600">
                            {txError || "Transaction failed"}
                        </div>
                    )}
                </div> : <div className="border border-gray-300 text-center rounded-sm py-6 space-y-2">
                    <div className="w-1/3 mx-auto text-center"><p>❌ 404 ❌</p></div>
                        <h1 className="">No Detected Wallet</h1>
                        <h1>Please connect ur wallet</h1>
                    </div>}
            </div>
        </div>
    )
}