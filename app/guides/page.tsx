"use client";
import { BookOpen } from "lucide-react";
import { AppShell, LinkCard, PageHeader } from "../../components/ui";

const GUIDES = [
  {
    href: "/guides/creating-wallets",
    title: "Creating passkey-based wallets",
    body: "Set up a Next.js app, wrap it in LazorkitProvider and connect a seedless wallet.",
    tag: "Start here",
  },
  {
    href: "/guides/triggering-gasless-txns",
    title: "Triggering gasless transactions",
    body: "Build a SOL transfer that Kora's paymaster pays for, using signAndSendTransaction.",
    tag: "Step 2",
  },
  {
    href: "/guides/swapping-on-raydium",
    title: "Swapping on Raydium",
    body: "Fetch quotes from Raydium's Trade API and execute a swap from a smart wallet.",
    tag: "Step 3",
  },
];

export default function GuideHome() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Guides"
        title="Build with Lazorkit, step by step"
        description="Written walkthroughs with copy-paste code. Each one matches a live example in this app."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <LinkCard key={g.href} {...g} icon={<BookOpen className="h-4 w-4" />} />
        ))}
      </div>
    </AppShell>
  );
}
