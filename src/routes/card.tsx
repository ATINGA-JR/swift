import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, Eye, EyeOff, Snowflake } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { envelopes, naira, txns } from "@/lib/swift-data";

export const Route = createFileRoute("/card")({
  component: CardScreen,
  head: () => ({
    meta: [
      { title: "Card · Swift" },
      {
        name: "description",
        content: "Your Swift virtual card, linked to the active envelope.",
      },
    ],
  }),
});

function CardScreen() {
  const [reveal, setReveal] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const active = envelopes.find((e) => e.active) ?? envelopes[0];
  const recent = txns.slice(0, 4);

  return (
    <PhoneShell>
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-600 text-sm">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
          Virtual Card
        </p>
        <span className="w-10" />
      </div>

      <div className="px-6">
        <div
          className={
            "aspect-[1.586/1] rounded-[20px] p-6 text-zinc-50 relative overflow-hidden flex flex-col justify-between shadow-xl transition " +
            (frozen
              ? "bg-gradient-to-br from-sky-900 to-zinc-900"
              : "bg-gradient-to-br from-emerald-deep via-zinc-950 to-zinc-950")
          }
        >
          <div className="absolute -top-14 -right-14 size-40 bg-emerald-400/15 blur-3xl rounded-full" />
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-medium tracking-[0.22em] opacity-70">
              SWIFT · VIRTUAL
            </span>
            <div className="text-[10px] font-medium uppercase tracking-wider bg-white/10 ring-1 ring-white/15 px-2 py-1 rounded-full">
              Mastercard
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-lg tracking-[0.2em] text-naira">
              {reveal ? (
                <span>5312 8809 4416 4829</span>
              ) : (
                <>
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span>4829</span>
                </>
              )}
            </div>
            <div className="flex gap-8 text-[10px] font-medium uppercase opacity-70">
              <div>
                <p>Expiry</p>
                <p className="text-zinc-50 text-sm mt-0.5 tracking-wide">08/27</p>
              </div>
              <div>
                <p>CVV</p>
                <p className="text-zinc-50 text-sm mt-0.5 tracking-wide">
                  {reveal ? "204" : "•••"}
                </p>
              </div>
              <button
                onClick={() => setReveal((v) => !v)}
                className="ml-auto flex items-center gap-1.5 text-emerald-200 text-[11px] normal-case"
              >
                {reveal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                {reveal ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button className="bg-white ring-1 ring-black/5 rounded-xl py-3 flex flex-col items-center gap-1 text-[11px] font-medium">
            <Copy className="size-4 text-emerald-deep" />
            Copy
          </button>
          <button
            onClick={() => setFrozen((f) => !f)}
            className={
              "rounded-xl py-3 flex flex-col items-center gap-1 text-[11px] font-medium ring-1 " +
              (frozen
                ? "bg-sky-100 ring-sky-200 text-sky-800"
                : "bg-white ring-black/5 text-zinc-800")
            }
          >
            <Snowflake className="size-4" />
            {frozen ? "Frozen" : "Freeze"}
          </button>
          <Link
            to="/decline"
            className="bg-white ring-1 ring-black/5 rounded-xl py-3 flex flex-col items-center gap-1 text-[11px] font-medium text-warning"
          >
            Demo
            <span className="text-[9px] text-zinc-400">Decline</span>
          </Link>
        </div>
      </div>

      <section className="px-6 mt-8">
        <div className="bg-white ring-1 ring-black/5 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
                Active envelope
              </p>
              <p className="text-base font-medium mt-1">{active.name}</p>
              <p className="text-xs text-zinc-500 text-naira">
                {naira(active.balance)} available
              </p>
            </div>
            <Link
              to="/envelope/$id"
              params={{ id: active.id }}
              className="text-xs font-medium text-emerald-deep bg-emerald-soft px-3 py-1.5 rounded-full ring-1 ring-emerald-deep/10 inline-flex items-center gap-1.5"
            >
              <span className="size-1.5 rounded-full bg-emerald-mid" />
              Switch
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 mt-8 mb-10">
        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-3">
          Card activity
        </h3>
        <ul className="divide-y divide-black/5 bg-white ring-1 ring-black/5 rounded-2xl px-4">
          {recent.map((t) => (
            <li key={t.id} className="py-3.5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t.merchant}</p>
                <p className="text-[11px] text-zinc-500">{t.when}</p>
              </div>
              <span className="text-sm font-medium text-naira">
                −{naira(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </PhoneShell>
  );
}