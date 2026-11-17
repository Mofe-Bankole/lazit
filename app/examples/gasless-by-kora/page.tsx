"use client";
import useBalance from "@/hooks/useBalances";
import useTransfer from "@/hooks/useTransfer";
import { useWallet } from "@lazorkit/wallet";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Wallet, Zap } from "lucide-react";
import { AppShell, Button, Card, EmptyState, Field, PageHeader, TxResult } from "../../../components/ui";

function SenderBalances({ pubkey }: { pubkey: PublicKey }) {
  const { SolBalance, fetchBalances, UsdcBalance, loading } = useBalance(pubkey);

  useEffect(() => {
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubkey.toString()]);

  return (
    <div className="mb-5 grid grid-cols-2 gap-3">
      {[
        ["SOL", SolBalance ? SolBalance.toFixed(4) : "0.0000"],
        ["USDC", UsdcBalance ? UsdcBalance.toFixed(2) : "0.00"],
      ].map(([label, value]) => (
        <button
          key={label}
          onClick={fetchBalances}
          className="cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left transition hover:border-white/20"
        >
          <span className="flex items-center justify-between text-xs text-zinc-500">
            {label}
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </span>
          <span className="mt-1 block font-mono text-lg">{value}</span>
        </button>
      ))}
    </div>
  );
}

const FLOW = [
  ["You sign", "Your passkey approves the transfer. Your wallet is not the fee payer."],
  ["Kora co-signs", "The paymaster (a Kora node) signs as fee payer and covers the SOL fee."],
  ["Solana confirms", "The transfer lands on-chain. Your balance only drops by the amount sent."],
];

export default function GaslessTransfers() {
  const { smartWalletPubkey, isConnected, isSigning, connect, isConnecting } = useWallet();
  const [recipient, setRecipient] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const sender = smartWalletPubkey ? smartWalletPubkey.toString() : "";
  const { explorerUrl, status, error, handleTransactions } = useTransfer({ recipient, amount, sender });

  return (
    <AppShell>
      <PageHeader
        back={{ href: "/examples", label: "Examples" }}
        eyebrow="Example · Kora"
        title="Gasless transfers"
        description="Send devnet SOL without paying the network fee. Lazorkit routes the transaction through Kora, which sponsors it."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Explainer */}
        <div className="lg:col-span-2">
          <ol className="space-y-5">
            {FLOW.map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#7857FF]/15 font-mono text-xs text-[#A08BFF]">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 space-y-2 border-t border-white/5 pt-6 text-sm text-zinc-400">
            <p>
              Fees can also be paid in USDC, BONK or your app&apos;s own token. You can run your own paymaster by following the{" "}
              <a href="https://launch.solana.com/docs/kora" target="_blank" rel="noreferrer" className="text-[#A08BFF] underline hover:text-white">
                Kora docs
              </a>
              .
            </p>
            <p>
              Want to build this page yourself? Read{" "}
              <Link href="/guides/triggering-gasless-txns" className="text-[#A08BFF] underline hover:text-white">
                Triggering gasless transactions
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          {isConnected && smartWalletPubkey ? (
            <Card>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-medium">
                  <Zap className="h-4 w-4 text-[#A08BFF]" /> Send without gas
                </h2>
                <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">Fee: sponsored</span>
              </div>
              <SenderBalances pubkey={smartWalletPubkey as PublicKey} />
              <div className="space-y-4">
                <Field
                  label="Recipient"
                  placeholder="Solana address"
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
                  onClick={handleTransactions}
                  loading={isSigning || status === "pending"}
                  disabled={!recipient || !amount}
                >
                  {isSigning || status === "pending" ? "Sending…" : "Send"}
                </Button>
              </div>
              <TxResult status={status} url={explorerUrl} error={error} />
            </Card>
          ) : (
            <EmptyState icon={<Wallet className="h-5 w-5" />} title="Connect your wallet to try it">
              <p>You&apos;ll sign with your passkey. No extension or seed phrase needed.</p>
              <Button className="mt-5" onClick={() => connect()} loading={isConnecting}>
                Connect wallet
              </Button>
            </EmptyState>
          )}
        </div>
      </div>
    </AppShell>
  );
}
