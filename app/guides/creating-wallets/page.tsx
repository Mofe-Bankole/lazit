"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell, Callout, CodeBlock, GuideSection as Section } from "../../../components/ui";

/* --------------------------------- */

export default function CreatingPasskeyEnabledWallets() {
  return (
    <AppShell width="max-w-3xl">
        <Link href="/guides" className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Guides
        </Link>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A08BFF]">Guide</p>

        {/* TITLE */}
        <h1 className="mt-2 mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Creating Passkey-Based Wallets with{" "}
          <span className="text-[#A08BFF]">Lazorkit</span>
        </h1>

        {/* INTRO */}
        <p className="text-zinc-400 mb-4">
          Traditional wallets rely on seed phrases, browser extensions, and long
          onboarding flows. This is fragile, intimidating, and easy to mess up.
        </p>

        <p className="text-zinc-400 mb-6">
          Lazorkit lets you create <strong>passkey-enabled wallets</strong> —
          secured by the device itself and usable directly inside your app.
        </p>

        <Callout type="success">
          No extensions. No seed phrases. Just passkeys.
        </Callout>

        {/* PREREQUISITES */}
        <Section title="Prerequisites">
          <ul className="list-disc pl-6 text-zinc-400 space-y-1">
            <li>
              <a
                href="https://nodejs.org/en"
                target="_blank"
                className="text-[#A08BFF] underline hover:text-white"
              >
                Node.js
              </a>{" "}
              v20+
            </li>
            <li>Any modern IDE (VS Code, Zed, Cursor)</li>
            <li>Chrome (recommended for passkeys)</li>
          </ul>
        </Section>

        {/* STEP 1 */}
        <Section title="Step 1 — Create a New Next.js App">
          <p className="text-zinc-400 mb-3">
            Open a terminal in your preferred directory and run:
          </p>

          <CodeBlock>{`npx create-next-app@latest passkey_build`}</CodeBlock>

          <p className="text-zinc-400">
            This creates a fresh Next.js project configured for modern React.
          </p>
        </Section>

        {/* STEP 2 */}
        <Section title="Step 2 — Install Lazorkit & Solana Dependencies">
          <CodeBlock>{`cd passkey_build
npm install @lazorkit/wallet@^3.4.1 @solana/web3.js@^1.99.0 @solana/spl-token`}</CodeBlock>

          <Callout type="info">
            Lazorkit handles wallet creation and signing. Solana libraries handle
            chain interaction.
          </Callout>
        </Section>

        {/* STEP 3 */}
        <Section title="Step 3 — Wrap Your App with LazorkitProvider">
          <p className="text-zinc-400 mb-4">
            Lazorkit must wrap your application to manage wallets and passkeys.
            Replace the contents of <code>app/layout.tsx</code> with:
          </p>

          <CodeBlock>{`"use client";

import { LazorkitProvider } from "@lazorkit/wallet";

export const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LazorkitProvider
          rpcUrl={CONFIG.RPC_URL}
          portalUrl={CONFIG.PORTAL_URL}
          paymasterConfig={CONFIG.PAYMASTER}
          cluster="devnet"
        >
          {children}
        </LazorkitProvider>
      </body>
    </html>
  );
}`}</CodeBlock>

          <Callout type="warn">
            Always use <strong>devnet</strong> while testing. Never deploy with
            test RPCs in production.
          </Callout>
        </Section>

        {/* STEP 4 */}
        <Section title="Step 4 — Add Wallet Connection Logic">
          <p className="text-zinc-400 mb-3">
            Connecting a wallet in Lazorkit is one function call.
          </p>

          <CodeBlock>{`"use client";

import { useWallet } from "@lazorkit/wallet";

export default function WalletConnect() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();

  if (isConnected && wallet) {
    return (
      <div className="flex justify-center mt-20">
        <button
          onClick={disconnect}
          className="px-6 py-2 bg-black text-white rounded-md"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-20">
      <button
        onClick={connect}
        className="px-6 py-2 bg-black text-white rounded-md"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  );
}`}</CodeBlock>

          <Callout type="success">
            Once connected, a passkey-secured wallet is created automatically.
          </Callout>
        </Section>

        {/* STEP 5 */}
        <Section title="Step 5 — Access the Wallet Address">
          <p className="text-zinc-400 mb-3">
            The address to show, fund and send from is
            <code className="rounded bg-white/10 text-zinc-200 px-1 mx-1 font-mono">
              vaultPubkey
            </code>. That&apos;s the vault, where the funds live.
          </p>
          <Callout type="warn">
            Don&apos;t use <code>smartWalletPubkey</code> as the user&apos;s address. Since{" "}
            <code>@lazorkit/wallet</code> 3.0 it is the internal wallet PDA, and nothing can spend
            from it. Funds sent there are stuck.
          </Callout>

          <CodeBlock>{`import { useWallet } from "@lazorkit/wallet";

export default function AddressButton() {
  const { vaultPubkey } = useWallet();

  const copy = () => {
    navigator.clipboard.writeText(
      vaultPubkey?.toString() || ""
    );
    alert("Address copied");
  };

  return (
    <span
      onClick={copy}
      className="font-mono text-sm cursor-pointer border px-3 py-2"
    >
      {vaultPubkey?.toString()}
    </span>
  );
}`}</CodeBlock>
        </Section>

        <Callout type="info">
          Fund your wallet using the{" "}
          <a
            href="https://faucet.solana.com"
            target="_blank"
            className="text-[#A08BFF] underline hover:text-white"
          >
            Solana Faucet
          </a>{" "}
          or{" "}
          <a
            href="https://faucet.circle.com"
            target="_blank"
            className="text-[#A08BFF] underline hover:text-white"
          >
            Circle Faucet
          </a>
          .
        </Callout>

        {/* NEXT */}
        <Section title="Next Steps">
          <p className="text-zinc-400">
            You’re ready to send transactions using this wallet.
          </p>

          <a
            href="/guides/triggering-gasless-txns"
            target="_blank"
            className="text-[#A08BFF] underline font-medium"
          >
            Triggering Gasless Transactions →
          </a>
        </Section>

        {/* REFERENCES */}
        <Section title="References">
          <ul className="space-y-1">
            <li>
              <a
                href="https://docs.lazorkit.com"
                target="_blank"
                className="text-[#A08BFF] underline hover:text-white"
              >
                Lazorkit Docs
              </a>
            </li>
            <li>
              <a
                href="https://launch.solana.com/products/kora"
                target="_blank"
                className="text-[#A08BFF] underline hover:text-white"
              >
                Kora
              </a>
            </li>
            <li>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                className="text-[#A08BFF] underline hover:text-white"
              >
                Next.js Docs
              </a>
            </li>
          </ul>
        </Section>
      </AppShell>
  );
}
