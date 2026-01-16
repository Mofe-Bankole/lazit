'use client'
import useBalance from "@/hooks/useBalances";
import BurnerModal from "../../../components/BurnerModal";
import ConnectionButton from "../../../components/ConnectionButton";
import WalletHeader from "../../../components/WalletHeader";
import { BurnerWallet } from "../../../lib/types";
import { PublicKey, useWallet } from "@lazorkit/wallet";
import axios from "axios";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import useTransfer from "@/hooks/useTransfer";

// eslint-disable-next-line react-hooks/exhaustive-deps
function BurnerBalance({ publicKey }: { publicKey: string }) {
    const { smartWalletPubkey } = useWallet();
    const { SolBalance, loading, fetchBalances, error } = useBalance(
        publicKey ? new PublicKey(publicKey) : null
    );

    // Fetch on mount
    // useEffect(() => {
    //     if (publicKey) {
    //         fetchBalances();
    //     }
    // }, [publicKey]);

    return (
        <span className="text-xl font-mono flex" onClick={fetchBalances} style={{ cursor: "pointer" }}>
            {loading ? (
                <span className="text-xs text-gray-400">Fetching...</span>
            ) : error ? (
                <span className="text-xs text-red-400">Err</span>
            ) : typeof SolBalance === "number" && SolBalance !== null ? (
                SolBalance.toFixed(4)
            ) : (
                "0.0000"
            )}
        </span>
    );
}

function handleSweep({ recipient, sender, amount }: { recipient: string, sender: string, amount: string }) {
    const { explorerUrl, handleTransactions, status } = useTransfer({ recipient, sender, amount });
    handleTransactions()

    if (status === "success") {
        return "success"
    } else {
        return "failure"
    }
}

export default function BurnerWalletPage() {
    const { smartWalletPubkey, isConnected } = useWallet();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wallets, setWallets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [owner, setOwner] = useState("");

    async function fetchUsersBurners() {
        setLoading(true);
        try {
            const res = await axios.get("/api/burners");
            if (res.data.success) {
                setWallets(res.data.wallets || []);
            } else {
                setWallets([]);
            }
        } catch (error) {
            console.error("Error fetching wallets:", error);
            setWallets([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsersBurners();
    }, []);

    function toggleModal() {
        setIsModalOpen(true);
    }

    async function handleDeleteWallet(publicKey: string) {
        if (!confirm("Are you sure you want to delete this burner wallet?")) {
            return;
        }

        try {
            const res = await axios.post(`/api/burners/del`, { publicKey });
            if (res.data.success) {
                fetchUsersBurners();
            } else {
                console.log("Delete burner failed: ", res.data.error);
            }
        } catch (error: any) {
            console.error("Error deleting wallet:", error);
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        console.log(text)
        alert("Address copied to clipboard");
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <WalletHeader />
            <BurnerModal
                isOpen={isModalOpen}
                owner={smartWalletPubkey?.toString() as string}
                onClose={() => setIsModalOpen(false)}
                onSubmit={() => {
                    // When the modal submits (wallet created), refresh the wallets
                    fetchUsersBurners();
                }}
            />

            <main className="flex-1 w-full">
                <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <a
                            href="/dashboard"
                            className="text-sm text-purple-600 underline"
                        >
                            ← Back to dashboard
                        </a>
                        <button
                            onClick={fetchUsersBurners}
                            className="cursor-pointer rounded-sm border border-gray-300 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                        >
                            Refresh
                        </button>
                    </div>

                    <header className="mb-4">
                        <h1 className="text-xl sm:text-2xl font-semibold mb-3">
                            Burner Wallets
                        </h1>
                        <p className="text-sm text-gray-600">
                            Temporary wallets for frictionless onboarding. Burners last for one
                            session and are tied to your connected wallet.
                        </p>
                    </header>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
                        {isConnected ? (
                            <button
                                className="cursor-pointer bg-black text-white rounded-sm px-4 py-3 text-sm font-semibold flex-1 sm:flex-none text-center"
                                onClick={toggleModal}
                            >
                                Create new burner
                            </button>
                        ) : (
                            <div className="flex-1 sm:flex-none">
                                <ConnectionButton />
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="py-10 text-center text-gray-400 text-sm">
                            Loading wallets...
                        </div>
                    ) : wallets.length > 0 ? (
                        <div className="mt-4 space-y-4">
                            {wallets.map((wallet: BurnerWallet, i) => (
                                <div
                                    key={wallet.publicKey}
                                    className="border border-gray-200 rounded-sm px-4 py-4 sm:px-6 sm:py-5"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="">
                                            <div className="text-sm text-gray-500 mb-0.5">
                                                Burner {i + 1}
                                            </div>
                                            <div className="font-semibold text-base sm:text-lg">
                                                {wallet.name || "Untitled burner"}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400">Balance</div>
                                            <div className="flex items-baseline justify-end gap-1">
                                                <BurnerBalance publicKey={wallet.publicKey} />
                                                <span className="text-xs text-gray-500">SOL</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                        <button className="cursor-pointer flex-1 border border-gray-300 font-semibold rounded px-3 py-2 text-sm hover:bg-green-100 transition">
                                            Send
                                        </button>
                                        <button
                                            className="cursor-pointer flex-1 border border-gray-300 font-semibold rounded px-3 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => copyToClipboard(wallet.publicKey)}
                                        >
                                            Receive
                                        </button>

                                        <button
                                            onClick={() => handleDeleteWallet(wallet.publicKey)}
                                            className="cursor-pointer flex-1 border border-red-400 text-red-600 font-semibold rounded px-3 py-2 text-sm hover:bg-red-200 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-7 cursor-pointer border border-gray-300 rounded-sm px-4 py-6 text-center text-sm text-gray-500">
                            <div className="flex flex-col text-center">
                                <h1 className="text-4xl"><X className="mb-6 w-1/2 mx-auto" ></X></h1>
                                <p className="mb-2 mt-2">No burner wallets yet.</p>
                            </div>
                            {isConnected ? (
                                <p>
                                    Click{" "}
                                    <span className="font-semibold">“Create new burner”</span> to
                                    spin up your first burner wallet.
                                </p>
                            ) : (
                                <p>Connect your wallet to create a burner.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
