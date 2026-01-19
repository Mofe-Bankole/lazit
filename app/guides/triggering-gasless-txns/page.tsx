"use client";

import Divider from "../../../components/Divider";
import WalletHeader from "../../../components/WalletHeader";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

/* --------------------------------- */
/* UI HELPERS                         */
/* --------------------------------- */

const Section = ({ title, children }: any) => (
  <section className="mb-12">
    <h3 className="text-2xl font-medium mb-3">{title}</h3>
    {children}
  </section>
);

const Callout = ({ type = "info", children }: any) => {
  const styles : any = {
    info: "border-blue-500 bg-blue-50 text-blue-900",
    warn: "border-yellow-500 bg-yellow-50 text-yellow-900",
    success: "border-green-500 bg-green-50 text-green-900",
  };

  return (
    <div className={`border-l-4 p-4 my-6 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
};

/* --------------------------------- */
/* PAGE                               */
/* --------------------------------- */

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <WalletHeader />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* BACK */}
        <a
          href="/dashboard"
          className="text-purple-600 underline text-sm mb-3 inline-block"
        >
          ← Back to Dashboard
        </a>

        {/* TITLE */}
        <h1 className="md:text-3xl text-[22px] font-semibold mb-4">
          Gasless Transactions with{" "}
          <span className="text-purple-600">Lazorkit</span>
        </h1>

        {/* INTRO */}
        <p className="text-gray-700 mb-4">
          This guide shows how to send SOL on Solana{" "}
          <strong>without the user paying gas</strong> using Lazorkit’s
          passkey-based wallets.
        </p>

        <p className="text-gray-700 mb-6">
          We’ll create a transaction, sign it with{" "}
          <code className="bg-gray-100 px-1 font-mono">useWallet()</code>, and let
          Lazorkit + Kora handle the fees.
        </p>

        <Divider />

        {/* PREREQ */}
        <Callout type="info">
          This guide assumes you’ve completed{" "}
          <a
            href="/guides/creating-wallets"
            target="_blank"
            className="underline font-medium"
          >
            Creating Passkey-Based Wallets with Lazorkit
          </a>
          .
        </Callout>

        {/* STEP 1 */}
        <Section title="Step 1 — How Gasless Transactions Work">
          <p className="text-gray-700 mb-3">
            Lazorkit exposes a{" "}
            <code className="font-mono bg-gray-100 px-1">
              signAndSendTransaction
            </code>{" "}
            method via the{" "}
            <code className="font-mono bg-gray-100 px-1">useWallet()</code> hook.
          </p>

          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Builds the transaction</li>
            <li>Signs it using passkeys</li>
            <li>Uses Kora as the gas paymaster</li>
            <li>Submits the transaction to Solana</li>
          </ul>

          <Callout type="success">
            No seed phrases. No gas popups. No wallet extensions.
          </Callout>
        </Section>

        {/* STEP 2 */}
        <Section title="Step 2 — Create the Transaction Handler">
          <p className="text-gray-700 mb-4">
            In your page or component file, create a function that builds and
            sends the transaction.
          </p>

          <div className="bg-[#0d0d0d] text-white rounded-md p-4 overflow-x-auto mb-4">
            <pre className={`text-sm ${jetbrainsMono.variable}`}>
{`import { useWallet } from "@lazorkit/wallet";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function useGaslessTransfer() {
  const {
    signAndSendTransaction,
    smartWalletPubkey,
    isSigning,
    isConnected,
  } = useWallet();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const sendSol = async (recipient: string, amount: string) => {
    if (!smartWalletPubkey || !recipient || !amount) return;

    try {
      setStatus("idle");

      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(lamports) || lamports <= 0) {
        throw new Error("Invalid amount");
      }

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          clusterSimulation: "devnet",
        },
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return { sendSol, status, isSigning, isConnected };
}`}
            </pre>
          </div>
        </Section>

        {/* STEP 3 */}
        <Section title="Step 3 — Build the Transfer UI">
          <p className="text-gray-700 mb-4">
            Attach the handler to a simple form so users can send SOL.
          </p>

          <div className="bg-[#0d0d0d] text-white rounded-md p-4 overflow-x-auto mb-4">
            <pre className={`text-sm ${jetbrainsMono.variable}`}>
{`import { useState } from "react";
import { useGaslessTransfer } from "./useGaslessTransfer";

export default function TransferForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { sendSol, status, isSigning, isConnected } = useGaslessTransfer();

  if (!isConnected) return null;

  return (
    <div className="border border-gray-300 p-6 rounded-md mt-6">
      <label className="block text-sm mb-2">Recipient Address</label>
      <input
        className="w-full border px-3 py-2 mb-4 text-sm font-mono"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <label className="block text-sm mb-2">Amount (SOL)</label>
      <input
        type="number"
        className="w-full border px-3 py-2 mb-4 text-sm"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={() => sendSol(recipient, amount)}
        disabled={isSigning}
        className="w-full bg-black text-white py-3 rounded-md text-sm"
      >
        {isSigning ? "Sending..." : "Send SOL"}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm mt-4 text-center">
          Transaction successful 🎉
        </p>
      )}
    </div>
  );
}`}
            </pre>
          </div>
        </Section>

        {/* MISTAKES */}
        <Callout type="warn">
          <strong>Common mistakes:</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Passing SOL instead of lamports</li>
            <li>Not checking wallet connection</li>
            <li>Forgetting <code>clusterSimulation: "devnet"</code></li>
          </ul>
        </Callout>

        {/* WRAP UP */}
        <Section title="What You Just Built">
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Gasless SOL transfers</li>
            <li>Passkey-based signing</li>
            <li>No wallet extensions required</li>
            <li>Fully compatible with devnet</li>
          </ul>

          <Callout type="success">
            You now have a production-ready gasless transaction flow.
          </Callout>
        </Section>
      </div>
    </div>
  );
}
