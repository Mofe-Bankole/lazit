"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  Fingerprint,
  Flame,
  KeyRound,
  QrCode,
  Repeat,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

const LINKS = {
  x: "https://x.com/Mofe_bnks",
  github: "https://github.com/Mofe-Bankole",
  lazorkit: "https://lazorkit.com/",
};

const FEATURES = [
  {
    icon: Fingerprint,
    title: "Passkey wallets",
    body: "Create a Solana smart wallet with Face ID, Touch ID or Windows Hello. No seed phrase, no extension.",
    guide: "/guides/creating-wallets",
    example: "/dashboard",
  },
  {
    icon: Zap,
    title: "Gasless transactions",
    body: "Let a paymaster cover fees so new users can transact before they ever hold SOL.",
    guide: "/guides/triggering-gasless-txns",
    example: "/examples/gasless-by-kora",
  },
  {
    icon: Repeat,
    title: "Raydium swaps",
    body: "Build and sign a real swap with a passkey, from quote to confirmed signature.",
    guide: "/guides/swapping-on-raydium",
    example: "/examples/raydium-swaps",
  },
  {
    icon: Flame,
    title: "Burner wallets",
    body: "Spin up short-lived wallets for one-off payments, then sweep funds back to your passkey wallet.",
    guide: null,
    example: "/examples/burner-wallets",
  },
];

const STEPS = [
  { n: "01", title: "Connect", body: "Your device creates a passkey. Lazorkit derives a smart wallet from it." },
  { n: "02", title: "Sign", body: "Every transaction is approved with a biometric prompt. Nothing to copy or store." },
  { n: "03", title: "Ship", body: "Read the matching guide and copy the exact code into your own app." },
];

const ADDONS = [
  {
    icon: CalendarClock,
    title: "Subscriptions",
    body: "Recurring USDC payments approved once with a passkey. Useful for SaaS and creator payments.",
  },
  {
    icon: KeyRound,
    title: "Session keys",
    body: "Scoped, time-limited signing for games and trading UIs, so users skip a prompt on every action.",
  },
  {
    icon: QrCode,
    title: "Payment links & QR",
    body: "Share a link, get paid. The recipient onboards with a passkey in seconds.",
  },
  {
    icon: Smartphone,
    title: "Multi-device recovery",
    body: "Add a second device's passkey as a backup signer and recover a wallet without a seed.",
  },
  {
    icon: ShieldCheck,
    title: "Spending policies",
    body: "Daily limits and allow-lists enforced on the smart wallet, configurable from the dashboard.",
  },
  {
    icon: BookOpen,
    title: "Interactive playground",
    body: "Edit Lazorkit snippets in the browser and run them against devnet without cloning anything.",
  },
];

const SNIPPET = `import { LazorkitProvider, useWallet } from "@lazorkit/wallet";

export function App() {
  return (
    <LazorkitProvider rpcUrl={RPC} portalUrl={PORTAL}
      paymasterConfig={{ paymasterUrl: PAYMASTER }}>
      <Connect />
    </LazorkitProvider>
  );
}

function Connect() {
  const { connect, smartWalletPubkey } = useWallet();
  return smartWalletPubkey
    ? <p>{smartWalletPubkey.toBase58()}</p>
    : <button onClick={connect}>Sign in with passkey</button>;
}`;

export default function Home() {
  const router = useRouter();
  const { connect, isConnected, isConnecting, wallet } = useWallet();

  useEffect(() => {
    if (isConnected && wallet) router.push("/dashboard");
  }, [isConnected, wallet, router]);

  const connectLabel = isConnecting ? "Connecting…" : "Create a passkey wallet";

  return (
    <div className="min-h-screen bg-[#0B0A12] text-zinc-100 selection:bg-[#7857FF]/40">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0B0A12]/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#7857FF]">
              <Fingerprint className="h-4 w-4 text-white" />
            </span>
            Lazit
          </Link>
          <div className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#code" className="hover:text-white">Code</a>
            <a href="#roadmap" className="hover:text-white">Roadmap</a>
          </div>
          <button
            onClick={() => connect()}
            disabled={isConnecting}
            className="rounded-lg bg-white px-3.5 py-1.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-60"
          >
            {isConnecting ? "Connecting…" : "Connect"}
          </button>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#7857FF]/25 blur-[120px]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:items-center md:pt-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Built on Lazorkit · the passkey SDK for Solana
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                Learn Lazorkit
                <br />
                <span className="bg-gradient-to-r from-[#A08BFF] to-[#7857FF] bg-clip-text text-transparent">
                  by using it.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
                Lazit is a hands-on playground for developers. Create a seedless wallet with a passkey,
                send gasless transactions, swap on Raydium, and read the code behind every step.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => connect()}
                  disabled={isConnecting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7857FF] px-5 py-3 font-medium text-white shadow-lg shadow-[#7857FF]/25 transition hover:bg-[#6a48f5] disabled:opacity-60"
                >
                  <Fingerprint className="h-4 w-4" />
                  {connectLabel}
                </button>
                <Link
                  href="/guides/creating-wallets"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-medium text-zinc-200 transition hover:bg-white/5"
                >
                  Read the guides <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
                {["No seed phrase", "No browser extension", "Fees can be sponsored"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#A08BFF]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Passkey mock */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>lazit.app</span>
                  <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-amber-300">devnet</span>
                </div>
                <div className="mt-10 flex flex-col items-center text-center">
                  <div className="relative grid h-20 w-20 place-items-center rounded-full bg-[#7857FF]/15 ring-1 ring-[#7857FF]/40">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#7857FF]/20" />
                    <Fingerprint className="h-10 w-10 text-[#A08BFF]" />
                  </div>
                  <p className="mt-5 font-medium">Sign in with your passkey</p>
                  <p className="mt-1 text-sm text-zinc-500">Use Face ID, Touch ID or your device PIN</p>
                </div>
                <div className="mt-10 space-y-2 rounded-xl border border-white/5 bg-black/30 p-4 font-mono text-xs">
                  <Row k="wallet" v="7xKX…9fQp" />
                  <Row k="signer" v="secp256r1 passkey" />
                  <Row k="fee payer" v="paymaster" accent />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-white/5 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHead
              eyebrow="What you can try"
              title="Every Lazorkit feature, with a live demo and a guide"
              body="Each card pairs a working example with a written walkthrough, so you can see it run and then build it yourself."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, body, guide, example }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#7857FF]/50 hover:bg-white/[0.05]"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#7857FF]/15 text-[#A08BFF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
                  <div className="mt-5 flex gap-4 text-sm">
                    <Link href={example} className="inline-flex items-center gap-1 text-white hover:text-[#A08BFF]">
                      Try it <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    {guide && (
                      <Link href={guide} className="text-zinc-400 hover:text-white">
                        Read guide
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-white/5 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHead eyebrow="How it works" title="From zero to signed transaction in three steps" />
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="border-l border-[#7857FF]/40 pl-5">
                  <span className="font-mono text-sm text-[#A08BFF]">{s.n}</span>
                  <h3 className="mt-2 text-lg font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code */}
        <section id="code" className="border-t border-white/5 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-5 md:items-center">
            <div className="md:col-span-2">
              <SectionHead
                eyebrow="Developer first"
                title="A passkey login in about 20 lines"
                body="Wrap your app in the provider, call connect(), and you have a Solana smart wallet. The guides walk through gasless transfers and swaps the same way."
              />
              <Link
                href="/guides/creating-wallets"
                className="mt-6 inline-flex items-center gap-1 text-sm text-[#A08BFF] hover:text-white"
              >
                Full wallet guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="min-w-0 md:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07060C]">
                <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 font-mono text-xs text-zinc-500">app.tsx</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-zinc-300">
                  <code>{SNIPPET}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap / add-ons */}
        <section id="roadmap" className="relative overflow-hidden border-t border-white/5 py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-30%] right-[-10%] h-[420px] w-[620px] rounded-full bg-[#7857FF]/15 blur-[120px]"
          />
          <div className="relative mx-auto max-w-6xl px-4">
            <SectionHead
              eyebrow="Roadmap"
              title="What's coming to Lazit next"
              body="Planned add-ons that show what passkey smart wallets make possible beyond sign-in."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ADDONS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[#A08BFF]" />
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-zinc-500">
                      Planned
                    </span>
                  </div>
                  <h3 className="mt-5 font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Builder */}
        <section className="border-t border-white/5 py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A08BFF]">Behind Lazit</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built to get more developers shipping with Lazorkit
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-zinc-400">
              I started Lazit to give new Solana developers one place to learn Lazorkit hands-on: working demos,
              written guides and copy-paste code. I&apos;d love to keep building tooling like this for the Lazorkit ecosystem.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={LINKS.x}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200"
              >
                Talk to me on X
              </a>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/15 px-5 py-3 font-medium text-zinc-200 transition hover:bg-white/5"
              >
                See my GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-zinc-500 sm:flex-row">
          <span>
            Made by{" "}
            <a href={LINKS.x} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white">
              Mofe_bnks
            </a>
          </span>
          <span>
            Powered by{" "}
            <a href={LINKS.lazorkit} target="_blank" rel="noreferrer" className="text-[#A08BFF] hover:text-white">
              Lazorkit
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A08BFF]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 leading-relaxed text-zinc-400">{body}</p>}
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{k}</span>
      <span className={accent ? "text-emerald-400" : "text-zinc-300"}>{v}</span>
    </div>
  );
}
