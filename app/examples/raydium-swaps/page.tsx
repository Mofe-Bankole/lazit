"use client"
import Divider from "@/components/Divider"
import { DEV_API_URLS } from '@raydium-io/raydium-sdk-v2';
import WalletHeader from "@/components/WalletHeader"
import config from "@/lib/config"
import { SOLANA_DEVNET_RPC } from "@/lib/constants"
import { Connection, useWallet } from "@lazorkit/wallet"
import React, { useEffect, useState } from "react"
import axios from "axios";
import useBalance from "@/hooks/useBalances";


const TOKENS = {
    SOL: {
        symbol: 'SOL',
        name: 'Solana',
        mint: 'So11111111111111111111111111111111111111112',
        decimals: 9,
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
        decimals: 6,
    },
};


export default function Raydium() {
    const connection = new Connection(config.SOLANA_RPC_URL || SOLANA_DEVNET_RPC, "confirmed")
    const { smartWalletPubkey, isConnected
        , isConnecting, isSigning, signAndSendTransaction, signMessage,
    } = useWallet()
    const {SolBalance , fetchBalances, UsdcBalance , loading} = useBalance(isConnected ? smartWalletPubkey : null)
    const [swapping, setSwapping] = useState(false);
    const [swapToken, setSwapToken] = useState<"SOL" | "USDC">("SOL");
    const [outputToken, setOutputToken] = useState<"SOL" | "USDC">("USDC");
    const [inputAmount, setInputAmount] = React.useState('');
    const [outputAmount, setOutputAmount] = useState('');
    const [quoteSuccess, setQuoteSuccess] = useState(false)
    const [error, setError] = useState("");
    const [swapStatus , setSwapStatus] = useState<boolean>(false)

    function setSOL() {
        setSwapToken("SOL")
        setOutputToken("USDC")
    }
    function setUSDC() {
        setSwapToken("USDC")
        setOutputToken("SOL")
    }

    const compueOutputAmount = async () => {
        if (!smartWalletPubkey || isConnected == false || parseFloat(inputAmount) <= 0) {
            setOutputAmount('')
            setError("Multiple Variables Unset")
            return
        }

        try {
            const inputMint = TOKENS[swapToken as keyof typeof TOKENS].mint;
            const outputMint = TOKENS[outputToken as keyof typeof TOKENS].mint;
            const swapAmount = parseFloat(inputAmount) * Math.pow(10, TOKENS[swapToken as keyof typeof TOKENS].decimals);

            const quoteResponse = await axios.get(
                `${DEV_API_URLS.SWAP_HOST}/compute/swap-base-in?` +
                `inputMint=${inputMint}&` +
                `outputMint=${outputMint}&` +
                `amount=${Math.floor(swapAmount)}&` +
                `slippageBps=50&` +
                `txVersion=LEGACY`
            );
            console.log(quoteResponse)

            if (!quoteResponse.data) {
                setQuoteSuccess(false)
            }
            
            const rawOutputAmount = parseFloat(quoteResponse.data.outputAmount)
            const formattedOutput = (rawOutputAmount / Math.pow(10, TOKENS[outputToken].decimals)).toFixed(6);

            setOutputAmount(formattedOutput);
        } catch (error) {
            console.error(error)
        }
    }

    
    useEffect(() =>{
        fetchBalances()
    } , [smartWalletPubkey])
    // --- LAYOUT REWRITE STARTS HERE ---
    // We'll make a two-column layout (on md+ screens):
    // Left: the explanatory/note card, Right: the swap form

    return (
        <div className="min-h-screen bg-white text-black relative">
            <WalletHeader />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <a href="/dashboard">Back</a>
                <div className="mt-7 space-y-5">
                    <h3 className="text-2xl">Gasless Swaps powered by Lazorkit X Raydium</h3>
                    <Divider />
                    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                        {/* LEFT: NOTE SECTION */}
                        <div className="md:w-1/2 border border-red-400 px-4 py-2.5 flex flex-col space-y-4 rounded-sm">
                            <h4 className="mb-2">NOTE</h4>
                            <p>
                                Swapping on Raydium(Devnet) is limited and its integration posed a great challange for me 🥲
                            </p>
                            <p>
                                For this demo SOL --- USDC is supported, if it doesnt work try USDC --- SOL
                            </p>
                            <p className="">Swapping on Raydium has never been eaier with lazorkit but due to some of the ongoing API erros, well have to make some changes</p>
                            <p>Choose the token to be swapped</p>
                            <p>If SOL - USDC doesnt work try USDC - SOL , raydium devnet is very tricky</p>

                        </div>
                        {/* RIGHT: SWAP FORM SECTION */}
                        <form
                            className="md:w-1/2 py-3 px-4 border border-gray-300 w-full mx-auto space-y-6 rounded-sm"
                            onSubmit={e => {
                                e.preventDefault();
                                // Add actual swap logic here if desired
                            }}
                        >
                            <div className="flex justify-between mb-2">
                                <h6>SOL</h6>
                                <p>{SolBalance}</p>
                            </div>
                            <div className="flex justify-between">
                                <h6>USDC</h6>
                                <p>{UsdcBalance}</p>
                            </div>
                            <div className="mb-6">
                                <label
                                    className="block text-sm text-gray-700 mb-2"
                                    htmlFor="swap-amount"
                                >
                                    Amount in {swapToken}
                                </label>
                                <input
                                    id="swap-amount"
                                    type="number"
                                    step="0.0001"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                                    placeholder="0.00"
                                    value={inputAmount}
                                    onChange={e => {
                                        setInputAmount(e.target.value);
                                        setError("");
                                    }}
                                    onBlur={compueOutputAmount}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <button
                                    className={`px-8 py-1.5 rounded-sm cursor-pointer focus:outline-none ${swapToken === "SOL" ? "bg-black text-white" : "bg-white border border-gray-300 text-black"}`}
                                    type="button"
                                    onClick={setSOL}
                                >
                                    SOL
                                </button>
                                <button
                                    className={`px-8 py-1.5 rounded-sm cursor-pointer ${swapToken === "USDC" ? "bg-black text-white" : "bg-white border border-gray-300 text-black"} focus:outline-none`}
                                    type="button"
                                    onClick={setUSDC}
                                >
                                    USDC
                                </button>
                            </div>
                            <h6 className="text-center">Swap {swapToken} for {outputToken}</h6>
                            {
                                outputAmount && (
                                    <div className="text-center mb-2">
                                        <p className="text-sm">
                                            You will get: <span className="font-mono">{outputAmount} {outputToken}</span>
                                        </p>
                                    </div>
                                )
                            }
                            {
                                error && <div className="text-red-500 text-sm text-center">{error}</div>
                            }
                            <button
                                className="w-full py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                                type="submit"
                                disabled={!inputAmount || swapping}
                            >
                                {swapping ? "Swapping..." : "Swap"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}