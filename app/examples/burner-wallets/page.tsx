'use client'
import BurnerModal from "@/components/BurnerModal";
import ConnectionButton from "@/components/ConnectionButton";
import WalletConnect from "@/components/WalletConnect";
import WalletHeader from "@/components/WalletHeader";
import { copyToClipboard } from "@/lib/clipboard";
import { useWallet } from "@lazorkit/wallet";
import axios from "axios";
import { useState, useEffect } from "react";

export default function BurnerWalletPage() {
    const {smartWalletPubkey , isConnected} = useWallet();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wallets, setWallets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            const res = await axios.delete(`/api/burners/${publicKey}`);
            if (res.data.success) {
                // Refresh the wallets list
                await fetchUsersBurners();
            } else {
                alert(res.data.error || "Failed to delete wallet");
            }
        } catch (error: any) {
            console.error("Error deleting wallet:", error);
            alert(error.response?.data?.error || "Failed to delete wallet");
        }
    }

    function copyToClipboard(text : string){
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="min-h-screen bg-white text-black relative ">
            <WalletHeader />
            <BurnerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={() => {
                    // When the modal submits (wallet created), refresh the wallets
                    fetchUsersBurners();
                }}
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <a href="/dashboard">Back</a>
                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        {isConnected ? 
                        <button className="cursor-pointer bg-black rounded-sm text-white px-6 py-3" onClick={toggleModal}>
                            Create New Burner
                        </button> : <ConnectionButton/>
                        }
                        <button onClick={fetchUsersBurners} className="cursor-pointer  rounded-sm text-black border border-gray-300 px-6 py-3">Fetch burners</button>
                    </div>
                    {loading ? (
                        <div className="py-8 text-center text-gray-400">Loading wallets...</div>
                    ) : wallets.length > 0 ? (
                        wallets.map((wallet, i) => (
                            <div key={wallet.publicKey} className="mt-8 mb-3.5 border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-lg">
                                        {wallet.name ? wallet.name : `Burner Wallet ${i + 1}`}
                                    </span>
                                    <span className="text-xs text-gray-400">Balance</span>
                                </div>
                                <div className="my-4 flex items-baseline">
                                    <span className="text-2xl font-mono">0.00</span>
                                    <span className="ml-2 text-sm text-gray-500">SOL</span>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button className="cursor-pointer flex-1 border border-gray-300 font-semibold rounded px-4 py-2 hover:bg-amber-200 transition">
                                        Send
                                    </button>
                                    <button className="cursor-pointer flex-1 border border-gray-300 font-semibold rounded px-4 py-2 hover:bg-green-100 transition">
                                        Receive
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteWallet(wallet.publicKey)}
                                        className="cursor-pointer flex-1 border border-red-400 text-red-600 font-semibold rounded px-4 py-2 hover:bg-red-100 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="mt-3 text-xs text-gray-400 break-all">
                                    Public Key: {wallet.publicKey}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-400">No wallets</div>
                    )}
                </div>
            </div>
        </div>
    );
}
