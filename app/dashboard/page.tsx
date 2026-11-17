"use client";
import { useBalance } from "@/hooks/useBalances";
import { useTransfer } from "@/hooks/useTransfer";
import { useWallet } from "@lazorkit/wallet";
import React, { useEffect } from "react";
import { BookOpen, Droplet, Flame, RefreshCw, Repeat, Send, Zap } from "lucide-react";
import { AppShell, Button, Card, Field, LinkCard, PageHeader, TxResult } from "../../components/ui";

export default function Dashboard() {
  // As at time of writing, lazit is only on devnet
  const { isSigning, smartWalletPubkey, isConnected, connect, isConnecting } = useWallet();
  const sender = smartWalletPubkey?.toString() as string;
  const { fetchBalances, SolBalance, UsdcBalance, loading } = useBalance(isConnected ? smartWalletPubkey : null);
  const [recipient, setRecipient] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const { handleTransactions, status, explorerUrl, error: txError } = useTransfer({ recipient, amount, sender });

  useEffect(() => {
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <AppShell>
      <PageHeader
        back={null}
        eyebrow="Devnet"
        title="Dashboard"
        description="Your passkey smart wallet. Check balances, send SOL, and jump into the examples and guides."
        actions={
          !isConnected && (
            <Button onClick={() => connect()} loading={isConnecting}>
              Connect wallet
            </Button>
          )
        }
      />

      {/* Balances */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Balance label="SOL" value={SolBalance?.toFixed(4) ?? "0.0000"} loading={loading} onRefresh={fetchBalances} />
        <Balance label="USDC" value={UsdcBalance?.toFixed(2) ?? "0.00"} loading={loading} onRefresh={fetchBalances} />
      </div>
      <p className="mt-3 flex items-start gap-2 text-sm text-zinc-500">
        <Droplet className="mt-0.5 h-4 w-4 shrink-0 text-[#A08BFF]" />
        <span>
          Need test funds? Use the{" "}
          <a href="https://faucet.solana.com" target="_blank" rel="noreferrer" className="text-zinc-300 underline hover:text-white">
            Solana faucet
          </a>{" "}
          for SOL and the{" "}
          <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="text-zinc-300 underline hover:text-white">
            Circle faucet
          </a>{" "}
          for USDC.
        </span>
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        {/* Send */}
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Send className="h-4 w-4 text-[#A08BFF]" />
            <h2 className="font-medium">Send SOL</h2>
          </div>
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
              loading={status === "pending"}
              disabled={!recipient || !amount || isSigning || !isConnected || loading}
            >
              {status === "pending" ? "Sending…" : "Send"}
            </Button>
          </div>
          <TxResult status={status} url={explorerUrl} error={txError} />
        </Card>

        {/* Explore */}
        <div className="lg:col-span-3">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-zinc-500">Examples</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
            <LinkCard href="/examples/burner-wallets" icon={<Flame className="h-4 w-4" />} title="Burner wallets" body="Short-lived wallets for one-off payments." />
            <LinkCard href="/examples/raydium-swaps" icon={<Repeat className="h-4 w-4" />} title="Raydium swaps" body="Swap SOL and USDC on Raydium devnet." />
            <LinkCard href="/examples/gasless-by-kora" icon={<Zap className="h-4 w-4" />} title="Gasless transfers" body="Send SOL while a paymaster pays the fee." />
          </div>
          <h2 className="mb-3 mt-8 text-sm font-medium uppercase tracking-[0.15em] text-zinc-500">Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <LinkCard href="/guides/creating-wallets" icon={<BookOpen className="h-4 w-4" />} title="Passkey wallets" body="Add Lazorkit wallets to a Next.js app." />
            <LinkCard href="/guides/triggering-gasless-txns" icon={<BookOpen className="h-4 w-4" />} title="Gasless transactions" body="Let Kora sponsor your users' fees." />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Balance({
  label,
  value,
  loading,
  onRefresh,
}: {
  label: string;
  value: string;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#7857FF]/10 blur-2xl" />
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">{label}</span>
        <button
          onClick={onRefresh}
          title="Refresh"
          className="cursor-pointer rounded-md p-1 text-zinc-500 transition hover:bg-white/5 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="mt-3 font-mono text-3xl font-medium tracking-tight">
        {loading ? <span className="text-zinc-600">—</span> : value}
      </p>
    </Card>
  );
}
