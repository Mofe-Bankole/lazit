"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@lazorkit/wallet";
import { Fingerprint } from "lucide-react";
import AddressButton from "./AddressButton";
import ConnectionButton from "./ConnectionButton";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/examples", label: "Examples" },
  { href: "/guides", label: "Guides" },
];

export default function WalletHeader() {
  const pathname = usePathname() ?? "";
  const { isConnected } = useWallet();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0B0A12]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-zinc-100">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#7857FF]">
              <Fingerprint className="h-4 w-4 text-white" />
            </span>
            <span className="hidden sm:inline">Lazit</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-md px-2.5 py-1.5 transition ${
                    active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && <AddressButton />}
          <ConnectionButton />
        </div>
      </div>
    </header>
  );
}
