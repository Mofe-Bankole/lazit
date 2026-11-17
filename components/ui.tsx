"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  CircleX,
  Copy,
  ExternalLink,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import WalletHeader from "./WalletHeader";

/* Shared building blocks for every page after the landing page.
   Colors match app/page.tsx: #0B0A12 background, #7857FF brand, #A08BFF accent. */

export function AppShell({ children, width = "max-w-5xl" }: { children: ReactNode; width?: string }) {
  return (
    <div className="min-h-screen bg-[#0B0A12] text-zinc-100 selection:bg-[#7857FF]/40">
      <WalletHeader />
      <main className={`mx-auto ${width} px-4 pb-20 pt-8 sm:pt-10`}>{children}</main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  back = { href: "/dashboard", label: "Dashboard" },
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string } | null;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A08BFF]">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 leading-relaxed text-zinc-400">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 ${className}`}>{children}</div>
  );
}

export function LinkCard({
  href,
  icon,
  title,
  body,
  tag,
}: {
  href: string;
  icon?: ReactNode;
  title: string;
  body: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#7857FF]/50 hover:bg-white/[0.05]"
    >
      <div className="flex items-center justify-between">
        {icon && (
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#7857FF]/15 text-[#A08BFF]">{icon}</span>
        )}
        {tag && (
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-zinc-500">
            {tag}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-medium text-zinc-100">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{body}</p>
      <span className="mt-4 text-sm text-[#A08BFF] transition group-hover:text-white">Open →</span>
    </Link>
  );
}

const BUTTON_STYLES = {
  primary: "bg-[#7857FF] text-white shadow-lg shadow-[#7857FF]/20 hover:bg-[#6a48f5]",
  secondary: "border border-white/15 text-zinc-200 hover:bg-white/5",
  danger: "border border-red-500/30 text-red-300 hover:bg-red-500/10",
  ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
};

export function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BUTTON_STYLES;
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_STYLES[variant]} ${className}`}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center justify-between text-sm text-zinc-400">
        {label}
        {hint && <span className="text-xs text-zinc-500">{hint}</span>}
      </span>
      <input
        {...props}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#7857FF]/70 focus:ring-2 focus:ring-[#7857FF]/20"
      />
    </label>
  );
}

const CALLOUT = {
  info: { icon: Info, cls: "border-sky-400/20 bg-sky-400/5 text-sky-100", ic: "text-sky-300" },
  warn: { icon: TriangleAlert, cls: "border-amber-400/20 bg-amber-400/5 text-amber-100", ic: "text-amber-300" },
  success: { icon: CircleCheck, cls: "border-emerald-400/20 bg-emerald-400/5 text-emerald-100", ic: "text-emerald-300" },
};

export function Callout({ type = "info", children }: { type?: keyof typeof CALLOUT; children: ReactNode }) {
  const { icon: Icon, cls, ic } = CALLOUT[type];
  return (
    <div className={`my-6 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${cls}`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${ic}`} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function CodeBlock({ children, title }: { children: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#07060C]">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <span className="font-mono text-xs text-zinc-500">{title ?? "code"}</span>
        <button
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1 text-xs text-zinc-500 transition hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function TxResult({
  status,
  url,
  error,
}: {
  status: "idle" | "pending" | "success" | "error";
  url?: string | null;
  error?: string | null;
}) {
  if (status === "success")
    return (
      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-200">
        <span className="flex items-center gap-2">
          <CircleCheck className="h-4 w-4" /> Transaction confirmed
        </span>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
            View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    );
  if (status === "error")
    return (
      <div className="mt-4 flex items-start gap-2 break-words rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200">
        <CircleX className="mt-0.5 h-4 w-4 shrink-0" />
        <span className="min-w-0">{error || "Transaction failed"}</span>
      </div>
    );
  return null;
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
      {icon && (
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-white/5 text-zinc-400">{icon}</div>
      )}
      <p className="font-medium">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">{children}</div>}
    </div>
  );
}

/* Long-form guide helpers */

export function GuideSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      <div className="space-y-4 leading-relaxed text-zinc-400 [&_a]:text-[#A08BFF] [&_a]:underline [&_a:hover]:text-white [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-zinc-200 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-zinc-300 [&_strong]:text-zinc-200 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
