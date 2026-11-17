"use client";
import { Flame, Repeat, Zap } from "lucide-react";
import { AppShell, LinkCard, PageHeader } from "../../components/ui";

export default function Examples() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Examples"
        title="Live Lazorkit demos"
        description="Each example runs on devnet with your passkey wallet. Fund it from the faucet on the dashboard first."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard
          href="/examples/gasless-by-kora"
          icon={<Zap className="h-4 w-4" />}
          title="Gasless transfers"
          body="Send SOL while Kora's paymaster covers the network fee."
          tag="Kora"
        />
        <LinkCard
          href="/examples/raydium-swaps"
          icon={<Repeat className="h-4 w-4" />}
          title="Raydium swaps"
          body="Get a quote from Raydium's Trade API and sign the swap with a passkey."
          tag="Raydium"
        />
        <LinkCard
          href="/examples/burner-wallets"
          icon={<Flame className="h-4 w-4" />}
          title="Burner wallets"
          body="Create short-lived wallets for one-off payments and sweep funds out of them."
          tag="Burners"
        />
      </div>
    </AppShell>
  );
}
