import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Zap, ArrowUpRight, MoreHorizontal, Check } from "lucide-react";
import { naira } from "@/lib/swift-data";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { useEnvelopes, useSetActiveEnvelope } from "@/lib/hooks/use-envelopes";

export const Route = createFileRoute("/envelope/$id")({
  component: EnvelopeDetail,
});

function EnvelopeDetail() {
  const { id } = Route.useParams();
  const { data: envelopes, isLoading } = useEnvelopes();
  const setActive = useSetActiveEnvelope();

  if (isLoading) {
    return <PhoneShell><div className="p-10 text-center text-sm text-zinc-500">Loading…</div></PhoneShell>;
  }

  const env = envelopes?.find((e) => e.id === id);

  if (!env) {
    return (
      <PhoneShell>
        <div className="p-10 text-center text-sm text-zinc-500">
          Envelope not found.
        </div>
      </PhoneShell>
    );
  }

  // Card transactions aren't wired yet — Sudo card issuance is a later phase.
  const list: { id: string; merchant: string; amount: number; when: string }[] = [];
  const spent = env.allocated - env.balance;
  const pct = env.allocated > 0 ? Math.min(100, (spent / env.allocated) * 100) : 0;

  return (
    <PhoneShell>
      <div className="bg-emerald-deep text-emerald-50 pt-12 pb-14 px-6 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-emerald-200 text-sm"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <button className="text-emerald-200">
            <MoreHorizontal className="size-5" />
          </button>
        </div>
        <div className="text-center">
          <div className="mx-auto size-14 rounded-2xl bg-white/10 ring-1 ring-white/20 grid place-items-center mb-5 text-lg font-medium">
            {env.letter}
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200 mb-2">
            {env.type === "goal" ? "Goal envelope" : "Spending envelope"}
          </p>
          <h1 className="text-4xl font-medium text-naira mb-2">
            {naira(env.balance)}
          </h1>
          <p className="text-sm text-emerald-200">
            of {naira(env.allocated)} allocated · {env.name}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5 shadow-sm">
          <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
            <span>Spent this month</span>
            <span className="text-zinc-700 text-naira">
              {naira(spent)} / {naira(env.allocated)}
            </span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-mid"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 flex gap-3">
        <button
          onClick={() => setActive.mutate(env.id)}
          disabled={env.active || setActive.isPending}
          className="flex-1 bg-emerald-deep hover:bg-emerald-mid transition text-emerald-50 py-3.5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {env.active ? (
            <>
              <Check className="size-4" />
              Active for card
            </>
          ) : (
            <>
              <Zap className="size-4" fill="currentColor" strokeWidth={0} />
              {setActive.isPending ? "Activating…" : "Activate for card"}
            </>
          )}
        </button>
        <button className="px-4 bg-white ring-1 ring-black/10 rounded-xl text-sm font-medium text-zinc-800">
          <ArrowUpRight className="size-4" />
        </button>
      </div>

      <section className="px-6 mt-10 mb-10">
        <div className="flex justify-between items-end border-b border-black/5 pb-3 mb-4">
          <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
            Recent activity
          </h3>
          <span className="text-[11px] text-zinc-400">This month</span>
        </div>
        <ul className="divide-y divide-black/5">
          {list.length === 0 && (
            <li className="py-8 text-center text-xs text-zinc-400">
              No card transactions yet.
            </li>
          )}
          {list.map((t) => (
            <li key={t.id} className="py-4 flex justify-between items-center">
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
