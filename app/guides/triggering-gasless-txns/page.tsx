"use client";
import Divider from "../../../components/Divider";
import { JetBrains_Mono } from "next/font/google";
import WalletHeader from "../../../components/WalletHeader";

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black relative --font-outfit">
      <WalletHeader />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/dashboard" className="underline hover:text-purple-600" >← Back To Dashboard</a>
        <h2 className="md:text-3xl text-[20.7px] mb-6 mt-1.5">
          Triggering Gasless Transactions with <span className="text-purple-600 contrast-150">Lazorkit</span>
        </h2>
        <p className="mb-1.5">
          This guide assumes you have finished the <a href="/guides/creating-wallets" className="text-blue-700" target="_blank">Creating Passkey-Based Wallets with Lazorkit</a> guide
        </p>
        <p className="mb-3.5">
          Signing transactions have never been easier on lazorkit and the flow is similar to how most devs do
          <br />You create a transaction instruction , then sign and send
          <br />
          Quite a simple process if you think about it
        </p>
        <p className="mb-1.5">
          Let me run u through how it works...
        </p>
        <Divider />
        <div className="my-1">
          <div className="mb-2">Lazorkit offers a signAndSendTransaction function from the useWallet() hook , this function abstracts away the other processes and 
            allows us to sign and send transactions while using Kora as our paymaster

          </div>
          <div>
            <h3 className="text-2xl">Edit your app/page.tsx or any desired file</h3>
          </div>
          In your app/page.tsx or any path you might prefer , create a HandleTransaction function as so
          <div className="bg-[#080807c4] text-white px-3 py-3 rounded-sm mb-2.5 mt-2">
            <pre
              className={`whitespace-pre overflow-hidden wrap-break-word md:text-sm text-[11px] ${jetbrainsMono.variable}`}
            >

              {`import { useWallet } from "@lazorkit/wallet";
import React, { useEffect , useState } from "react";

function handleTransaction(){
  const { signAndSendTransaction, isSigning, smartWalletPubkey, isConnected } =
    useWallet();
  const [txStatus, setTxStatus] = useState<"idle" | "success" | "error" | "pending">("idle");
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
 
  const handleTransaction = async () => {
    if (!smartWalletPubkey || !recipient || !amount) return;

    try {
      setTxStatus("idle");
      setTxError("");
      const recipientPubkey = new PublicKey(recipient);
      const amountInLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(amountInLamports) || amountInLamports <= 0) {
        setTxError("Invalid amount");
        setTxStatus("error");
        return;
      }  

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: amountInLamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          clusterSimulation : 'devnet' // This is for devnet
        },
      });

      if (signature) {
        setTxStatus("success");
        setRecipient("");
        setAmount("");
        await fetchUserBalances();
      }
       alert("Transaction Successful");
    } catch(error){
      console.error(error)
    }
  }
                  };
                  `}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
