"use client";
import { useWallet } from "@lazorkit/wallet";
import AddressButton from "./AddressButton";
import DisconnectButton from "./ConnectionButton";

export default function WalletHeader() {
  const { wallet } = useWallet();

  return (
    <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-2 py-2 flex items-center justify-between">
            <div className="text-xl font-medium text-black"><span className="text-purple-500">Lazit</span></div>
            <DisconnectButton/>
            {wallet?.walletDevice && (
                <div className="text-xs text-gray-500">{wallet.walletDevice}</div>
            )}
        </div>
    </div>
  );
}
