import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Plus } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { goals, naira } from "@/lib/swift-data";

export const Route = createFileRoute("/goals")({
  component: Goals,
  head: () => ({
    meta: [
      { title: "Goals · Swift" },
      {
        name: "description",
        content: "Goal envelopes — save toward what matters, locked by default.",
      },
    ],
  }),
});

function Goals() {
  return (
    <PhoneShell>
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-600 text-sm">
          <ArrowLeft className="size-4" /> Home
        </Link>
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
          Goals
        </p>
        <button className="text-zinc-600">
          <Plus className="size-5" />
        </button>
      </div>

      <div className="px-6 mt-2 mb-10 space-y-4">
        {goals.map((g) => {
          const pct = Math.min(100, (g.balance / (g.target ?? 1)) * 100);
          return (
            <div key={g.id} className="bg-white ring-1 ring-black/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.18em]">
                    Target · {g.deadline}
                  </p>
                  <h3 className="text-lg font-medium mt-1">{g.name}</h3>
                </div>
                <span className="text-[10px] font-semibold text-emerald-deep bg-emerald-soft px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Lock className="size-2.5" /> Locked
                </span>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-2xl font-medium text-naira">
                    {naira(g.balance)}
                  </span>
                  <span className="text-xs text-zinc-500 text-naira">
                    of {naira(g.target ?? 0)}
                  </span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-deep"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">{pct.toFixed(0)}% funded</p>
              </div>
            </div>
          );
        })}
      </div>
    </PhoneShell>
  );
}