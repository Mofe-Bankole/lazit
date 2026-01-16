"use client"
import Divider from "../../../components/Divider"
import { DEV_API_URLS } from '@raydium-io/raydium-sdk-v2';
import WalletHeader from "../../../components/WalletHeader"
import { Connection, PublicKey, Transaction, useWallet } from "@lazorkit/wallet"
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
        mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',  // Devnet
        decimals: 6,
    },
};


export default function Raydium() {
    const { smartWalletPubkey, isConnected , signAndSendTransaction
    } = useWallet()
    const [swapping, setSwapping] = useState(false);
    const [swapToken, setSwapToken] = useState<"SOL" | "USDC">("SOL");
    const [outputToken, setOutputToken] = useState<"SOL" | "USDC">("USDC");
    const [inputAmount, setInputAmount] = React.useState('');
    const [outputAmount, setOutputAmount] = useState('');
    const [quoteSuccess, setQuoteSuccess] = useState(false)
    const [error, setError] = useState("");
    const [quote, setQuote] = useState<any>(null)
    const [swapStatus, setSwapStatus] = useState<"idle" | "success" | "error">("idle");

    function setSOL() {
        setSwapToken("SOL")
        setOutputToken("USDC")
        setInputAmount('');
        setOutputAmount('');
        setError('')
    }
    function setUSDC() {
        setSwapToken("USDC");
        setOutputToken("SOL");
        setInputAmount('');
        setOutputAmount('');
        setError('')
    }

    function SwapBalances({ pubkey }: { pubkey: PublicKey }) {
        const { SolBalance, fetchBalances, UsdcBalance } = useBalance(pubkey)

        useEffect(() => {
            fetchBalances()
        } ,[])
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

    const compueOutputAmount = async () => {
        // CHekcs some params
        if (!smartWalletPubkey || isConnected == false || !inputAmount || parseFloat(inputAmount) <= 0) {
            setError("Multiple Variables Unset")
            setOutputAmount('')
            return
        }

        setError('')
        try {
            const inputMint = TOKENS[swapToken].mint;
            const outputMint = TOKENS[outputToken].mint;
            const swapAmount = parseFloat(inputAmount) * Math.pow(10, TOKENS[swapToken].decimals);

            const quoteResponse = await axios.get(
                `${DEV_API_URLS.SWAP_HOST}/compute/swap-base-in?` +
                `inputMint=${inputMint}&` +
                `outputMint=${outputMint}&` +
                `amount=${Math.floor(swapAmount)}&` +
                `slippageBps=50&` +
                `txVersion=LEGACY`
            );

            console.log(quoteResponse.data)

            if (!quoteResponse.data) {
                setQuoteSuccess(false)
                setError("Failed to Get Quote")
                setQuote(null);
                setSwapStatus("error")
                return;
            }

            const rawOutputAmount = parseFloat(quoteResponse.data.outputAmount)
            const formattedOutput = (rawOutputAmount / Math.pow(10, TOKENS[outputToken].decimals)).toFixed(6);

            setOutputAmount(formattedOutput);
        } catch (error) {
            console.error(error)
            setError(`${error}`)
        }
    }


    const executeSwap = async () => {
        if (!quote || !quoteSuccess) {
            setError("Error Fetching Quotes");
            return;
        }

        if (!inputAmount) {
            setError("Amount Not Set");
            return
        }

        setSwapping(true);
        setError("");
        setSwapStatus("idle")


        try {
            const inputMint = TOKENS[swapToken as keyof typeof TOKENS].mint;
            const outputMint = TOKENS[outputToken as keyof typeof TOKENS].mint;
            // const swapAmount = parseFloat(inputAmount) * Math.pow(10, TOKENS[swapToken as keyof typeof TOKENS].decimals);

            // fetch the swap from raydium
            const { data: swapResponse } = await axios.get(`${DEV_API_URLS.SWAP_HOST}/compute/swap-base-in?...&txVersion=LEGACY`)
            const { data: swapData } = await axios.post(`${DEV_API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
                swapResponse,
                TxVersion: "LEGACY",
                wallet: smartWalletPubkey?.toString(),
                wrapSol: inputMint === TOKENS.SOL.mint,
                unwrapSol: outputMint === TOKENS.SOL.mint,
            })

            const transactionBuffer = Buffer.from(swapData.data[0].transaction, 'base64');
            const legacyTx = Transaction.from(transactionBuffer);

            // got this fix from Codex on X
            const COMPUTE_BUDGET_PROGRAM = new PublicKey('ComputeBudget111111111111111111111111111111');
            const instructions = legacyTx.instructions.filter(
                ix => !ix.programId.equals(COMPUTE_BUDGET_PROGRAM)
            );

            instructions.forEach((ix) => {
                const hasSmartWallet = ix.keys.some(k => k.pubkey.toBase58() === smartWalletPubkey?.toString());
                if (!hasSmartWallet) {
                    ix.keys.push({ pubkey: smartWalletPubkey as PublicKey, isSigner: false, isWritable: false });
                }
            });

            const signature = await signAndSendTransaction({
                instructions,
                transactionOptions: { computeUnitLimit: 600_000 }
            });
            
            console.log(signature)
        } catch (error : any) {
            console.error(error)
            alert(`Swap Unsuccessful : ${error}`)
        }
    }

    return (
        <div className="min-h-screen bg-white text-black relative">
            <WalletHeader />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <a href="/dashboard">Back</a>
                <div className="mt-7 space-y-1">
                    <h3 className="text-2xl">Gasless Swaps powered by <span className="text-purple-600">Lazorkit</span> X <span className="text-blue-600">Raydium</span></h3>
                    <Divider />
                    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                        {/* LEFT: NOTE SECTION */}
                        <div className="md:w-1/2 border border-gray-300  px-4 py-2.5 flex flex-col space-y-4 rounded-sm">
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
                        
           
                        <form
                            className="md:w-1/2 py-3 px-4 border border-gray-300 w-full mx-auto space-y-6 rounded-sm"
                            onSubmit={e => {
                                e.preventDefault();
                                // Add actual swap logic here if desired
                            }}
                        >

                            <div className="mb-6">
                                <SwapBalances pubkey={smartWalletPubkey as PublicKey} />
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
                                onClick={executeSwap}
                                disabled={!inputAmount || swapping || !isConnected}
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