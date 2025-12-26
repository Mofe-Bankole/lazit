'use client'
import Header from "@/components/Header";
import WalletConnect from "@/components/WalletConnect";

export default function Home() {
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-slate-900 h-full">
      <Header/>
      <WalletConnect/>
    </div>
  );
}
