"use client"
import { useWallet } from '@lazorkit/wallet';

export default function WalletConnect() {
  const {connect , isConnected , isConnecting , wallet , disconnect} = useWallet()

  if (isConnected && wallet){
    return(
      <div className="min-h-screen flex items-center justify-center w-full">
        <button className="px-6 py-2 rounded-lg bg-slate-800 text-slate-100 cursor-pointer shadow-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-lg" onClick={() => disconnect()}>
          Disconnect
        </button>
     </div>
    )
  }


    return(
        <div className="min-h-screen flex items-center justify-center w-full">
        <button className="px-6 py-2 rounded-lg bg-slate-800 text-slate-100 cursor-pointer shadow-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-lg" onClick={() => connect()}>
          Connect Wallet
        </button>
      </div>
    )
}
