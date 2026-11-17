"use client"
import { DEV_API_URLS } from '@raydium-io/raydium-sdk-v2';
import { PublicKey, Transaction, useWallet } from "@lazorkit/wallet"
import { PublicKey as Web3PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import React, { useEffect, useState } from "react"
import Link from "next/link";
import axios from "axios";
import { ArrowDownUp, RefreshCw, TriangleAlert, Wallet } from "lucide-react";
import useBalance from "@/hooks/useBalances";
import { AppShell, Button, Card, EmptyState, PageHeader, TxResult } from "../../../components/ui";

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
type Token = keyof typeof TOKENS;

const COMPUTE_BUDGET_PROGRAM = new PublicKey('ComputeBudget111111111111111111111111111111');

function SwapBalances({ pubkey }: { pubkey: PublicKey }) {
    const { SolBalance, fetchBalances, UsdcBalance, loading } = useBalance(pubkey)

    useEffect(() => {
        fetchBalances()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pubkey.toString()])

    return (
        <button
            onClick={fetchBalances}
            className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-lg bg-black/30 px-3 py-2 text-xs text-zinc-400 transition hover:text-white"
        >
            <span>
                Balance: <span className="font-mono text-zinc-200">{SolBalance ? SolBalance.toFixed(4) : "0.0000"}</span> SOL ·{" "}
                <span className="font-mono text-zinc-200">{UsdcBalance ? UsdcBalance.toFixed(2) : "0.00"}</span> USDC
            </span>
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
    )
}

function TokenBox({ label, token, children }: { label: string; token: Token; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-zinc-500">{label}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">{children}</div>
                <span className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-sm font-medium">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${token === "SOL" ? "bg-gradient-to-br from-[#9945FF] to-[#14F195] text-black" : "bg-[#2775CA] text-white"}`}>
                        {token === "SOL" ? "◎" : "$"}
                    </span>
                    {token}
                </span>
            </div>
        </div>
    )
}

export default function Raydium() {
    const { smartWalletPubkey, isConnected, signAndSendTransaction, connect, isConnecting } = useWallet()
    const [swapping, setSwapping] = useState(false);
    const [quoting, setQuoting] = useState(false);
    const [swapToken, setSwapToken] = useState<Token>("SOL");
    const outputToken: Token = swapToken === "SOL" ? "USDC" : "SOL";
    const [inputAmount, setInputAmount] = React.useState('');
    const [outputAmount, setOutputAmount] = useState('');
    const [error, setError] = useState("");
    const [quote, setQuote] = useState<any>(null)
    const [swapStatus, setSwapStatus] = useState<"idle" | "success" | "error">("idle");
    const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

    function flip() {
        setSwapToken(outputToken);
        setInputAmount('');
        setOutputAmount('');
        setQuote(null);
        setError('');
        setSwapStatus("idle");
    }

    const computeOutputAmount = async () => {
        if (!inputAmount || parseFloat(inputAmount) <= 0) {
            setOutputAmount('')
            setQuote(null)
            return
        }

        setError('')
        setQuoting(true)
        try {
            const swapAmount = parseFloat(inputAmount) * Math.pow(10, TOKENS[swapToken].decimals);
            const { data: quoteResponse } = await axios.get(
                `${DEV_API_URLS.SWAP_HOST}/compute/swap-base-in?` +
                `inputMint=${TOKENS[swapToken].mint}&` +
                `outputMint=${TOKENS[outputToken].mint}&` +
                `amount=${Math.floor(swapAmount)}&` +
                `slippageBps=50&` +
                `txVersion=LEGACY`
            );

            // Raydium wraps the quote as { success, data: { outputAmount, ... } }
            if (!quoteResponse?.success) {
                setQuote(null)
                setOutputAmount('')
                setError(quoteResponse?.msg || "Raydium couldn't quote this swap. Try the other direction.")
                return;
            }

            const rawOutputAmount = parseFloat(quoteResponse.data.outputAmount)
            setOutputAmount((rawOutputAmount / Math.pow(10, TOKENS[outputToken].decimals)).toFixed(6));
            setQuote(quoteResponse);
        } catch (error) {
            console.error(error)
            setQuote(null)
            setError(`${error}`)
        } finally {
            setQuoting(false)
        }
    }

    // Re-quote shortly after the user stops typing
    useEffect(() => {
        setQuote(null);
        const t = setTimeout(computeOutputAmount, 600);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputAmount, swapToken]);

    const executeSwap = async () => {
        if (!quote || !smartWalletPubkey) {
            setError("Get a quote first");
            return;
        }
        const walletKey = smartWalletPubkey;

        setSwapping(true);
        setError("");
        setSwapStatus("idle")

        try {
            const isInputSol = swapToken === "SOL";
            const isOutputSol = outputToken === "SOL";
            const owner = new Web3PublicKey(walletKey.toString());
            // The smart wallet is a PDA, so its token accounts are derived with allowOwnerOffCurve
            const ata = (mint: string) =>
                getAssociatedTokenAddressSync(new Web3PublicKey(mint), owner, true).toBase58();

            const { data: swapData } = await axios.post(`${DEV_API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
                computeUnitPriceMicroLamports: "0",
                swapResponse: quote,
                txVersion: "LEGACY",
                wallet: walletKey.toString(),
                wrapSol: isInputSol,
                unwrapSol: isOutputSol,
                inputAccount: isInputSol ? undefined : ata(TOKENS[swapToken].mint),
                outputAccount: isOutputSol ? undefined : ata(TOKENS[outputToken].mint),
            })

            if (!swapData?.success) throw new Error(swapData?.msg || "Raydium couldn't build the swap transaction");

            const legacyTx = Transaction.from(Buffer.from(swapData.data[0].transaction, 'base64'));

            // Lazorkit manages the compute budget itself, so drop Raydium's ComputeBudget instructions
            const instructions = legacyTx.instructions.filter(
                ix => !ix.programId.equals(COMPUTE_BUDGET_PROGRAM)
            );

            instructions.forEach((ix) => {
                const hasSmartWallet = ix.keys.some(k => k.pubkey.toBase58() === walletKey.toString());
                if (!hasSmartWallet) {
                    ix.keys.push({ pubkey: walletKey, isSigner: false, isWritable: false });
                }
            });

            const signature = await signAndSendTransaction({
                instructions,
                transactionOptions: { computeUnitLimit: 600_000 }
            });

            setExplorerUrl(`https://solscan.io/tx/${signature}?cluster=devnet`);
            setSwapStatus("success");
            setInputAmount('');
        } catch (error: any) {
            console.error(error)
            setError(error?.message ?? `${error}`)
            setSwapStatus("error")
        } finally {
            setSwapping(false)
        }
    }

    return (
        <AppShell>
            <PageHeader
                back={{ href: "/examples", label: "Examples" }}
                eyebrow="Example · Raydium"
                title="Swap on Raydium with a passkey"
                description="Quotes come from Raydium's Trade API. Your Lazorkit smart wallet signs the swap, with no extension involved."
            />

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    {isConnected && smartWalletPubkey ? (
                        <Card className="mx-auto max-w-lg">
                            <SwapBalances pubkey={smartWalletPubkey} />

                            <TokenBox label="You pay" token={swapToken}>
                                <input
                                    type="number"
                                    step="0.0001"
                                    min="0"
                                    placeholder="0.00"
                                    aria-label={`Amount in ${swapToken}`}
                                    value={inputAmount}
                                    onChange={e => {
                                        setInputAmount(e.target.value);
                                        setError("");
                                        setSwapStatus("idle");
                                    }}
                                    className="w-full bg-transparent font-mono text-2xl text-zinc-100 outline-none placeholder:text-zinc-700"
                                />
                            </TokenBox>

                            <div className="relative z-10 -my-3 flex justify-center">
                                <button
                                    onClick={flip}
                                    title="Switch direction"
                                    className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-white/10 bg-[#13111C] text-zinc-400 transition hover:rotate-180 hover:text-white"
                                >
                                    <ArrowDownUp className="h-4 w-4" />
                                </button>
                            </div>

                            <TokenBox label="You receive (estimate)" token={outputToken}>
                                <p className="truncate font-mono text-2xl text-zinc-300">
                                    {quoting ? <span className="text-base text-zinc-500">Getting quote…</span> : outputAmount || <span className="text-zinc-700">0.00</span>}
                                </p>
                            </TokenBox>

                            <p className="mt-3 text-xs text-zinc-500">Slippage 0.5% · Devnet pools only</p>

                            <Button
                                className="mt-4 w-full py-3"
                                onClick={executeSwap}
                                loading={swapping}
                                disabled={!inputAmount || !quote || quoting}
                            >
                                {swapping ? "Swapping…" : `Swap ${swapToken} for ${outputToken}`}
                            </Button>

                            {error && swapStatus !== "error" && (
                                <p className="mt-3 text-sm text-red-300">{error}</p>
                            )}
                            <TxResult status={swapStatus} url={explorerUrl} error={error} />
                        </Card>
                    ) : (
                        <EmptyState icon={<Wallet className="h-5 w-5" />} title="Connect your wallet to swap">
                            <p>You&apos;ll need devnet SOL or USDC. Grab some from the faucets on the dashboard.</p>
                            <Button className="mt-5" onClick={() => connect()} loading={isConnecting}>
                                Connect wallet
                            </Button>
                        </EmptyState>
                    )}
                </div>

                <aside className="space-y-4 lg:col-span-2">
                    <div className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-relaxed text-amber-100">
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                        <p>
                            Raydium&apos;s devnet pools are unreliable. If SOL → USDC fails, flip the direction and try USDC → SOL.
                        </p>
                    </div>
                    <Card>
                        <h2 className="font-medium">Under the hood</h2>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
                            <li>Raydium&apos;s Trade API returns a quote, then builds a legacy swap transaction for your wallet.</li>
                            <li>Raydium&apos;s ComputeBudget instructions are removed, because Lazorkit sets the compute budget itself.</li>
                            <li>Your smart wallet signs and sends the remaining instructions after a passkey prompt.</li>
                        </ol>
                        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/5 pt-4 text-sm">
                            <Link href="/guides/swapping-on-raydium" className="text-[#A08BFF] hover:text-white">Read the guide →</Link>
                            <a href="https://docs.raydium.io/raydium/traders/trade-api" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">
                                Raydium Trade API docs
                            </a>
                        </div>
                    </Card>
                </aside>
            </div>
        </AppShell>
    )
}
