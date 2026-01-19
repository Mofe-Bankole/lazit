"use client";
import useBalance from "@/hooks/useBalances";
import useTransfer from "@/hooks/useTransfer";
import { useWallet } from "@lazorkit/wallet";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import Divider from "../../../components/Divider";
import WalletHeader from "../../../components/WalletHeader";

export default function GaslessTransfers() {

    const { smartWalletPubkey, isConnected
        , isSigning
    } = useWallet();
    const { loading } = useBalance(isConnected ? smartWalletPubkey : null);
    const [recipient, setRecipient] = React.useState<string>("");
    const [amount, setAmount] = React.useState<string>("");
    const sender = smartWalletPubkey ? smartWalletPubkey.toString() : "";
    const { explorerUrl, status, error , handleTransactions } = useTransfer({ recipient, amount, sender });

    function SenderBalances({ pubkey }: { pubkey: PublicKey }) {
        const { SolBalance, fetchBalances, UsdcBalance } = useBalance(pubkey)

        return (
            <div className="flex flex-col mb-6 border border-gray-300 cursor-pointer p-3 rounded-sm" onClick={fetchBalances}>
                <div className="flex justify-between mb-2.5">
                    <h6>SOL</h6>
                    <p>{SolBalance ? SolBalance.toFixed(4) : "0.0000"}</p>
                </div>
                <div className="flex justify-between">
                    <h6>USDC</h6>
                    <p>{UsdcBalance ? UsdcBalance.toFixed(2) : "0.00"}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-black relative">
            <WalletHeader />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-4">
                    <a
                        href="/dashboard"
                        className="text-sm text-purple-700 underline"
                    >
                        ← Back to dashboard
                    </a>
                </div>
                <div className="text-normal">
                    <p className="text-xl">So how exactly does Lazorkit trigger <span className="text-purple-500 contrast-75">Gasless Transactions ?</span></p>
                    <Divider />
                    <p className="mb-3">Thats all thanks to <a href="https://launch.solana.com/products/kora" className="text-[#483939f2]" target="_blank">Kora</a>. <br /><a href="https://launch.solana.com/products/kora" className="text-[#483939f2]" target="_blank">Kora</a> is a solana signing structure that handles gas fees without removing as much as a cent from users accounts</p>
                    <p className="mb-3">Users can also pay fees in USDC, BONK or in your apps native token </p>
                    <p className="mb-3">Kora sponsors transactions using a  'paymaster' which is simply a Kora Node</p>
                    <p>As a developer / dApp Builder you can run your very own Kora Node/Paymster . Visit <a href="https://launch.solana.com/docs/kora">Kora Docs to find out how</a></p>
                    <p className="mb-3">If you want to also learn how i built this exact page check out my guide @ <a href="/guides/triggering-gasless-txns" target="_blank">Triggering Gasless Transactions</a></p>
                </div>

                {isConnected ? <div className="border border-gray-300 p-6 mt-10 rounded-sm">
                    <SenderBalances pubkey={smartWalletPubkey as PublicKey} />
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
                        className="w-full py-3 rounded-sm bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        onClick={handleTransactions}
                        disabled={!recipient || !amount || isSigning || loading || !smartWalletPubkey}
                    >
                        {isSigning ? "Sending..." : "Send"}
                    </button>

                    {status === "success" && (
                        <div className="mt-5 text-sm sm:text-center text-green-600">
                            <p>Transaction Successful!</p>
                            {explorerUrl && (
                                <a
                                    href={explorerUrl}
                                    className="cursor-pointer underline text-green-800 mt-2"
                                    target="_blank" >
                                    View Transaction

                                </a>
                            )}
                        </div>
                    )}
                    {status === "error" && (
                        <div className="mt-4 text-sm text-center text-red-600">
                            {error || "Transaction failed"}
                        </div>
                    )}
                </div> : <div className="border border-gray-300 text-center rounded-sm py-6 space-y-2 mt-3">
                    <div className="w-1/3 mx-auto text-center"><p>❌ 404 ❌</p></div>
                    <h1 className="">No Detected Wallet</h1>
                    <h1>Please connect ur wallet</h1>
                </div>}
            </div>
        </div>
    )
}