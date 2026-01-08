"use client";
import { useWallet } from "@lazorkit/wallet";
import { useRouter } from "next/navigation";

export default function WalletConnect() {
  const { connect, isConnected, isConnecting, wallet, disconnect } =
    useWallet();
  const router = useRouter();

  if (isConnected && wallet){
    router.push("/dashboard");

    return(
      <div className="min-h-screen flex items-center justify-center w-full">
        <button className="px-6 py-2 rounded-lg bg-slate-800 text-slate-100 cursor-pointer shadow-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-lg" onClick={() => disconnect()}>
          Disconnect
        </button>
     </div>
    )
  }
  else{
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <button
          className="px-6 py-2 rounded-lg bg-slate-800 text-slate-100 cursor-pointer shadow-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-lg"
          onClick={() => connect()}
        >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }
}
