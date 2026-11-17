'use client'
import useBalance from "@/hooks/useBalances";
import BurnerModal from "../../../components/BurnerModal";
import { BurnerWallet } from "../../../lib/types";
import { PublicKey, useWallet } from "@lazorkit/wallet";
import axios from "axios";
import { Check, Copy, Flame, Plus, RefreshCw, Send, Trash2, Wallet, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useBurner } from "@/hooks/useBurner";
import { AppShell, Button, Card, EmptyState, Field, PageHeader, TxResult } from "../../../components/ui";

function BurnerBalance({ publicKey }: { publicKey: string }) {
    const { SolBalance, loading, fetchBalances, error } = useBalance(
        publicKey ? new PublicKey(publicKey) : null
    );

    useEffect(() => {
        if (publicKey) {
            fetchBalances();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey]);

    return (
        <button onClick={fetchBalances} title="Refresh balance" className="cursor-pointer text-right">
            <span className="block text-xs text-zinc-500">Balance</span>
            <span className="font-mono text-xl">
                {loading ? (
                    <span className="text-sm text-zinc-500">Fetching…</span>
                ) : error ? (
                    <span className="text-sm text-red-300">Error</span>
                ) : typeof SolBalance === "number" ? (
                    SolBalance.toFixed(4)
                ) : (
                    "0.0000"
                )}
            </span>
            <span className="ml-1 text-xs text-zinc-500">SOL</span>
        </button>
    );
}

function timeLeft(expiresAt: number) {
    const mins = Math.max(0, Math.round((expiresAt - Date.now()) / 60000));
    return mins >= 60 ? "1h left" : `${mins}m left`;
}

export default function BurnerWalletPage() {
    const { smartWalletPubkey, isConnected, connect, isConnecting } = useWallet();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wallets, setWallets] = useState<BurnerWallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [sender, setSender] = useState<PublicKey | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const { explorerURL, status, handleBurnerSweep, error } = useBurner({ recipient, sender, amount });

    function openSweep(publicKey: string) {
        setSender(new PublicKey(publicKey));
        setRecipient(smartWalletPubkey?.toString() ?? "");
        setAmount("");
    }

    function closeSweep() {
        setSender(null);
        setRecipient("");
        setAmount("");
    }

    async function fetchUsersBurners() {
        if (!smartWalletPubkey) { setLoading(false); return; }
        setLoading(true);
        try {
            const res = await axios.get(`/api/burners?owner=${smartWalletPubkey.toString()}`);
            setWallets(res.data.success ? res.data.wallets || [] : []);
        } catch (error) {
            console.error("Error fetching wallets:", error);
            setWallets([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsersBurners();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartWalletPubkey]);

    async function handleDeleteWallet(publicKey: string) {
        if (!confirm("Delete this burner wallet? Any funds left in it will be lost.")) return;
        try {
            const res = await axios.post(`/api/burners/del`, { publicKey });
            if (res.data.success) {
                if (sender?.toString() === publicKey) closeSweep();
                fetchUsersBurners();
            } else {
                console.log("Delete burner failed: ", res.data.error);
            }
        } catch (error) {
            console.error("Error deleting wallet:", error);
        }
    }

    function copyAddress(text: string) {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 1500);
    }

    return (
        <AppShell>
            <BurnerModal
                isOpen={isModalOpen}
                owner={smartWalletPubkey?.toString() as string}
                onClose={() => setIsModalOpen(false)}
                onSubmit={() => fetchUsersBurners()}
            />

            <PageHeader
                back={{ href: "/examples", label: "Examples" }}
                eyebrow="Example · Burners"
                title="Burner wallets"
                description="Short-lived wallets tied to your passkey wallet. Use one for a single payment, then sweep what's left back. Each burner expires after an hour."
                actions={
                    isConnected && (
                        <>
                            <Button variant="secondary" onClick={fetchUsersBurners} title="Refresh">
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            </Button>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="h-4 w-4" /> New burner
                            </Button>
                        </>
                    )
                }
            />

            {!isConnected ? (
                <EmptyState icon={<Wallet className="h-5 w-5" />} title="Connect your wallet to manage burners">
                    <p>Burners belong to the passkey wallet that created them.</p>
                    <Button className="mt-5" onClick={() => connect()} loading={isConnecting}>
                        Connect wallet
                    </Button>
                </EmptyState>
            ) : loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[0, 1].map((i) => (
                        <div key={i} className="h-40 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]" />
                    ))}
                </div>
            ) : wallets.length === 0 ? (
                <EmptyState icon={<Flame className="h-5 w-5" />} title="No burner wallets yet">
                    <p>Create one, fund it from the faucet, and try sweeping it back.</p>
                    <Button className="mt-5" onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" /> New burner
                    </Button>
                </EmptyState>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {wallets.map((wallet) => {
                        const sweeping = sender?.toString() === wallet.publicKey;
                        return (
                            <Card key={wallet.publicKey} className={sweeping ? "border-[#7857FF]/40" : ""}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Flame className="h-4 w-4 shrink-0 text-orange-300" />
                                            <h3 className="truncate font-medium">{wallet.name || "Untitled burner"}</h3>
                                        </div>
                                        <button
                                            onClick={() => copyAddress(wallet.publicKey)}
                                            className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs text-zinc-500 transition hover:text-white"
                                        >
                                            {wallet.publicKey.slice(0, 6)}…{wallet.publicKey.slice(-6)}
                                            {copied === wallet.publicKey ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                        <p className="mt-1 text-xs text-zinc-600">{timeLeft(wallet.expiresAt)}</p>
                                    </div>
                                    <BurnerBalance publicKey={wallet.publicKey} />
                                </div>

                                {sweeping ? (
                                    <div className="mt-5 space-y-3 border-t border-white/5 pt-5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Send from this burner</p>
                                            <button onClick={closeSweep} title="Cancel" className="cursor-pointer text-zinc-500 hover:text-white">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <Field
                                            label="Recipient"
                                            hint="defaults to your wallet"
                                            className="[&_input]:font-mono"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                        />
                                        <Field
                                            label="Amount"
                                            hint="SOL"
                                            type="number"
                                            step="0.0001"
                                            min="0"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                        <Button
                                            className="w-full"
                                            onClick={handleBurnerSweep}
                                            loading={status === "pending"}
                                            disabled={!recipient || !amount}
                                        >
                                            {status === "pending" ? "Sending…" : "Send"}
                                        </Button>
                                        <TxResult status={status} url={explorerURL} error={error} />
                                    </div>
                                ) : (
                                    <div className="mt-5 grid grid-cols-3 gap-2">
                                        <Button variant="secondary" className="px-2!" onClick={() => openSweep(wallet.publicKey)}>
                                            <Send className="h-3.5 w-3.5" /> Send
                                        </Button>
                                        <Button variant="secondary" className="px-2!" onClick={() => copyAddress(wallet.publicKey)}>
                                            <Copy className="h-3.5 w-3.5" /> Receive
                                        </Button>
                                        <Button variant="danger" className="px-2!" onClick={() => handleDeleteWallet(wallet.publicKey)}>
                                            <Trash2 className="h-3.5 w-3.5" /> Delete
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </AppShell>
    );
}
