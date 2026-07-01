import { createFileRoute, Link } from "@tanstack/react-router";
import { X, AlertOctagon, ArrowRight } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { naira } from "@/lib/swift-data";

export const Route = createFileRoute("/decline")({
  component: Decline,
  head: () => ({
    meta: [
      { title: "Card declined · Swift" },
      {
        name: "description",
        content:
          "Swift declines a card transaction the instant an envelope hits zero — the budget enforces itself.",
      },
    ],
  }),
});

function Decline() {
  return (
    <PhoneShell dark hideNav>
      <div className="min-h-screen relative flex flex-col text-zinc-100 px-8 pt-16 pb-10 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-24 left-1/4 size-72 bg-red-900 blur-[110px] rounded-full" />
        </div>

        <div className="relative flex justify-between items-center mb-14">
          <Link
            to="/card"
            className="size-8 rounded-full bg-white/5 ring-1 ring-white/10 grid place-items-center"
          >
            <X className="size-4" />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Real-time decline
          </p>
          <span className="w-8" />
        </div>

        <div className="animate-decline-shake mx-auto mb-10 relative">
          <div className="w-56 aspect-[1.586/1] bg-zinc-900 rounded-[14px] ring-1 ring-white/10 p-5 flex flex-col justify-center items-center opacity-90">
            <div className="size-11 rounded-full bg-red-950 ring-1 ring-red-500/30 grid place-items-center mb-3">
              <AlertOctagon className="size-5 text-red-400" />
            </div>
            <p className="text-zinc-400 text-[10px] tracking-[0.22em] uppercase">
              Transaction declined
            </p>
          </div>
        </div>

        <h1 className="text-[26px] font-medium tracking-tight mb-3 text-balance">
          Your Feeding envelope is empty.
        </h1>
        <p className="text-zinc-400 text-sm max-w-[30ch] mx-auto mb-8">
          Sudo declined <strong className="text-zinc-200">Bolt Food</strong> for{" "}
          <span className="text-naira text-zinc-200">{naira(2500)}</span>. No overdraft, no fallback envelope.
        </p>

        <div className="mx-auto w-full max-w-[320px] bg-white/5 ring-1 ring-white/10 rounded-2xl p-5 text-left mb-10">
          <Row label="Merchant" value="Bolt Food" />
          <Row label="Attempted" value={naira(2500)} />
          <Row label="Active envelope" value="Feeding" />
          <div className="h-px bg-white/10 my-3" />
          <Row label="Envelope balance" value={naira(0)} tone="danger" />
        </div>

        <div className="mt-auto space-y-3">
          <Link
            to="/allocate"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-300 hover:bg-emerald-200 transition text-emerald-950 py-4 rounded-xl text-sm font-semibold"
          >
            Move money into Feeding
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/card"
            className="block text-zinc-500 text-[11px] font-medium uppercase tracking-[0.18em] py-2"
          >
            Dismiss
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "danger";
}) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-[11px] text-zinc-500 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={
          "text-sm font-medium text-naira " +
          (tone === "danger" ? "text-red-400" : "text-zinc-100")
        }
      >
        {value}
      </span>
    </div>
  );
}