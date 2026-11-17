"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell, Callout, CodeBlock, GuideSection as Section } from "../../../components/ui";

/* --------------------------------- */

export default function Home() {
  return (
    <AppShell width="max-w-3xl">
        <Link href="/guides" className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Guides
        </Link>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A08BFF]">Guide</p>

        {/* TITLE */}
        <h1 className="mt-2 mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Gasless Transactions with{" "}
          <span className="text-[#A08BFF]">Lazorkit</span>
        </h1>

        {/* INTRO */}
        <p className="text-zinc-400 mb-4">
          This guide shows how to send SOL on Solana{" "}
          <strong>without the user paying gas</strong> using Lazorkit’s
          passkey-based wallets.
        </p>

        <p className="text-zinc-400 mb-6">
          We’ll create a transaction, sign it with{" "}
          <code className="rounded bg-white/10 text-zinc-200 px-1 font-mono">useWallet()</code>, and let
          Lazorkit + Kora handle the fees.
        </p>

        {/* PREREQ */}
        <Callout type="info">
          This guide assumes you’ve completed{" "}
          <a
            href="/guides/creating-wallets"
            target="_blank"
            className="font-medium text-[#A08BFF] underline hover:text-white"
          >
            Creating Passkey-Based Wallets with Lazorkit
          </a>
          .
        </Callout>

        {/* STEP 1 */}
        <Section title="Step 1 — How Gasless Transactions Work">
          <p className="text-zinc-400 mb-3">
            Lazorkit exposes a{" "}
            <code className="font-mono rounded bg-white/10 text-zinc-200 px-1">
              signAndSendTransaction
            </code>{" "}
            method via the{" "}
            <code className="font-mono rounded bg-white/10 text-zinc-200 px-1">useWallet()</code> hook.
          </p>

          <ul className="list-disc pl-6 text-zinc-400 space-y-1">
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
          <p className="text-zinc-400 mb-4">
            In your page or component file, create a function that builds and
            sends the transaction.
          </p>

          <CodeBlock>{`import { useWallet } from "@lazorkit/wallet";
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
}`}</CodeBlock>
        </Section>

        {/* STEP 3 */}
        <Section title="Step 3 — Build the Transfer UI">
          <p className="text-zinc-400 mb-4">
            Attach the handler to a simple form so users can send SOL.
          </p>

          <CodeBlock>{`import { useState } from "react";
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
}`}</CodeBlock>
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
          <ul className="list-disc pl-6 text-zinc-400 space-y-1">
            <li>Gasless SOL transfers</li>
            <li>Passkey-based signing</li>
            <li>No wallet extensions required</li>
            <li>Fully compatible with devnet</li>
          </ul>

          <Callout type="success">
            You now have a production-ready gasless transaction flow.
          </Callout>
        </Section>
      </AppShell>
  );
}
