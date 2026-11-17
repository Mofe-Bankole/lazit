"use client";
import Link from "next/link";
import Markdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { AppShell, CodeBlock } from "../../../components/ui";
import { RAYDIUM_GUIDE } from "./content";

export default function SwappingOnRaydiumGuide() {
  return (
    <AppShell width="max-w-3xl">
      <Link href="/guides" className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Guides
      </Link>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A08BFF]">Guide</p>
      <h1 className="mb-8 mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Swapping on Raydium with <span className="text-[#A08BFF]">Lazorkit</span>
      </h1>

      <article className="leading-relaxed text-zinc-400 [&_a]:text-[#A08BFF] [&_a]:underline [&_a:hover]:text-white [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_strong]:text-zinc-200 [&_ul]:list-disc [&_ul]:pl-5">
        <Markdown
          components={{
            h6: ({ children }) => (
              <h2 className="mb-3 mt-12 text-xl font-semibold tracking-tight text-zinc-100">{children}</h2>
            ),
            pre: ({ children }) => {
              const el = children as { props?: { children?: unknown; className?: string } };
              const text = String(el?.props?.children ?? "").replace(/\n$/, "");
              const lang = /language-(\w+)/.exec(el?.props?.className ?? "")?.[1];
              return <CodeBlock title={lang}>{text}</CodeBlock>;
            },
            code: ({ children, className }) => (
              <code className={className ?? "rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-zinc-200"}>
                {children}
              </code>
            ),
          }}
        >
          {RAYDIUM_GUIDE}
        </Markdown>
      </article>

      <div className="mt-14 flex flex-col gap-3 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">Ready to try it?</p>
        <Link
          href="/examples/raydium-swaps"
          className="rounded-lg bg-[#7857FF] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#6a48f5]"
        >
          Open the Raydium example →
        </Link>
      </div>
    </AppShell>
  );
}
