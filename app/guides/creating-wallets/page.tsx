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

export default function CreatingPasskeyEnabledWallets() {
  return (
    <div className="min-h-screen bg-white text-black">
      <WalletHeader />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* BACK */}
        <a
          href="/dashboard"
          className="text-purple-600 underline text-sm mb-3 inline-block"
        >
          ← Back to dashboard
        </a>

        {/* TITLE */}
        <h1 className="md:text-3xl text-[22px] font-semibold mb-4">
          Creating Passkey-Based Wallets with{" "}
          <span className="text-purple-600">Lazorkit</span>
        </h1>

        {/* INTRO */}
        <p className="text-gray-700 mb-4">
          Traditional wallets rely on seed phrases, browser extensions, and long
          onboarding flows. This is fragile, intimidating, and easy to mess up.
        </p>

        <p className="text-gray-700 mb-6">
          Lazorkit lets you create <strong>passkey-enabled wallets</strong> —
          secured by the device itself and usable directly inside your app.
        </p>

        <Callout type="success">
          No extensions. No seed phrases. Just passkeys.
        </Callout>

        <Divider />

        {/* PREREQUISITES */}
        <Section title="Prerequisites">
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              <a
                href="https://nodejs.org/en"
                target="_blank"
                className="underline"
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
          <p className="text-gray-700 mb-3">
            Open a terminal in your preferred directory and run:
          </p>

          <div className="bg-[#0d0d0d] text-white rounded-md p-4 overflow-x-auto mb-4">
            <pre className={`text-sm ${jetbrainsMono.variable}`}>
{`npx create-next-app@latest passkey_build`}
            </pre>
          </div>

          <p className="text-gray-700">
            This creates a fresh Next.js project configured for modern React.
          </p>
        </Section>

        <Divider />

        {/* STEP 2 */}
        <Section title="Step 2 — Install Lazorkit & Solana Dependencies">
          <div className="bg-[#0d0d0d] text-white rounded-md p-4 overflow-x-auto mb-4">
            <pre className={`text-sm ${jetbrainsMono.variable}`}>
{`cd passkey_build
npm install @lazorkit/wallet @solana/web3.js @coral-xyz/anchor @solana/spl-token`}
            </pre>
          </div>

          <Callout type="info">
            Lazorkit handles wallet creation and signing. Solana libraries handle
            chain interaction.
          </Callout>
        </Section>

        <Divider />

        {/* STEP 3 */}
        <Section title="Step 3 — Wrap Your App with LazorkitProvider">
          <p className="text-gray-700 mb-4">
            Lazorkit must wrap your application to manage wallets and passkeys.
            Replace the contents of <code>app/layout.tsx</code> with:
          </p>

          <div className="bg-[#0d0d0d] text-white rounded-md p-4 overflow-x-auto mb-4">
            <pre className={`text-sm ${jetbrainsMono.variable}`}>
{`"use client";

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
        >
          {children}
        </LazorkitProvider>
      </body>
    </html>
  );
}`}
            </pre>
          </div>

          <Callout type="warn">
            Always use <strong>devnet</strong> while testing. Never deploy with
            test RPCs in production.
          </Callout>
        </Section>

        <Divider />

        {/* STEP 4 */}
        <Section title="Step 4 — Add Wallet Connection Logic">
          <p className="text-gray-700 mb-3">
            Connecting a wallet in Lazorkit is one function call.
          </p>

          <div className="bg-[#0d0d0d] text-white rounded-md p-4 overflow-x-auto mb-4">
            <pre className={`text-sm ${jetbrainsMono.variable}`}>
{`"use client";

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
}`}
            </pre>
          </div>

          <Callout type="success">
            Once connected, a passkey-secured wallet is created automatically.
          </Callout>
        </Section>

        <Divider />

        {/* STEP 5 */}
        <Section title="Step 5 — Access the Wallet Address">
          <p className="text-gray-700 mb-3">
            You can access the wallet’s public key via
            <code className="bg-gray-100 px-1 mx-1 font-mono">
              smartWalletPubkey
            </code>.
          </p>

          <div className="bg-[#0d0d0d] text-white rounded-md p-4 overflow-x-auto mb-4">
            <pre className={`text-sm ${jetbrainsMono.variable}`}>
{`import { useWallet } from "@lazorkit/wallet";

export default function AddressButton() {
  const { smartWalletPubkey } = useWallet();

  const copy = () => {
    navigator.clipboard.writeText(
      smartWalletPubkey?.toString() || ""
    );
    alert("Address copied");
  };

  return (
    <span
      onClick={copy}
      className="font-mono text-sm cursor-pointer border px-3 py-2"
    >
      {smartWalletPubkey?.toString()}
    </span>
  );
}`}
            </pre>
          </div>
        </Section>

        <Callout type="info">
          Fund your wallet using the{" "}
          <a
            href="https://faucet.solana.com"
            target="_blank"
            className="underline"
          >
            Solana Faucet
          </a>{" "}
          or{" "}
          <a
            href="https://faucet.circle.com"
            target="_blank"
            className="underline"
          >
            Circle Faucet
          </a>
          .
        </Callout>

        {/* NEXT */}
        <Section title="Next Steps">
          <p className="text-gray-700">
            You’re ready to send transactions using this wallet.
          </p>

          <a
            href="/guides/triggering-gasless-txns"
            target="_blank"
            className="text-blue-700 underline font-medium"
          >
            Triggering Gasless Transactions →
          </a>
        </Section>

        <Divider />

        {/* REFERENCES */}
        <Section title="References">
          <ul className="space-y-1">
            <li>
              <a
                href="https://docs.lazorkit.com"
                target="_blank"
                className="underline"
              >
                Lazorkit Docs
              </a>
            </li>
            <li>
              <a
                href="https://launch.solana.com/products/kora"
                target="_blank"
                className="underline"
              >
                Kora
              </a>
            </li>
            <li>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                className="underline"
              >
                Next.js Docs
              </a>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
