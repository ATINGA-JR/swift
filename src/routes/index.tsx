import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Plus, ArrowRight, AlertTriangle } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import {
  colorClass,
  envelopes,
  goals,
  naira,
  wallet,
} from "@/lib/swift-data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const spending = envelopes.filter((e) => e.type === "spending");
  const subsEnv = envelopes.find((e) => e.id === "subs")!;
  return (
    <PhoneShell>
      <header className="pt-12 px-6 pb-10 bg-zinc-950 text-zinc-50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.18em] mb-2">
              Total Balance
            </p>
            <h1 className="text-[40px] font-medium leading-none text-naira">
              {naira(wallet.total)}
              <span className="text-zinc-500 text-2xl">.00</span>
            </h1>
          </div>
          <div className="size-9 rounded-full bg-zinc-800 ring-1 ring-white/10 grid place-items-center text-xs font-semibold">
            AO
          </div>
        </div>
        <Link
          to="/fund"
          className="inline-flex items-center gap-2 bg-emerald-900/40 hover:bg-emerald-900/60 transition-colors px-3 py-1.5 rounded-full ring-1 ring-emerald-500/20"
        >
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-50 text-naira">
            {naira(wallet.available)} available to assign
          </span>
          <ArrowRight className="size-3 text-emerald-200" />
        </Link>
      </header>

      <div className="px-6 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl ring-1 ring-black/5 shadow-sm p-2 grid grid-cols-3 divide-x divide-black/5">
          <QuickAction to="/fund" label="Fund" />
          <QuickAction to="/allocate" label="Allocate" />
          <QuickAction to="/card" label="Card" />
        </div>
      </div>

      <section className="px-6 mt-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
            Spending Envelopes
          </h2>
          <button className="text-[11px] font-medium text-emerald-deep flex items-center gap-1">
            <Plus className="size-3" /> New
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {spending.map((e) => (
            <Link
              key={e.id}
              to="/envelope/$id"
              params={{ id: e.id }}
              className="bg-white rounded-2xl ring-1 ring-black/5 p-4 h-40 flex flex-col justify-between relative overflow-hidden hover:ring-black/10 transition"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${colorClass[e.color].bar}`}
              />
              <div className="flex justify-between items-start">
                <div
                  className={`size-9 rounded-lg grid place-items-center text-xs font-semibold ${colorClass[e.color].letter}`}
                >
                  {e.letter}
                </div>
                {e.active && (
                  <span className="text-[9px] font-semibold text-emerald-deep bg-emerald-soft px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Active
                  </span>
                )}
                {e.balance === 0 && (
                  <AlertTriangle className="size-4 text-warning" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">{e.name}</p>
                <p className="text-lg font-medium text-naira mt-0.5">
                  {naira(e.balance)}
                </p>
                <div className="mt-2 h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorClass[e.color].bar}`}
                    style={{
                      width: `${Math.min(100, (e.balance / e.allocated) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 mt-10">
        <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-4">
          Fixed Expenses
        </h2>
        <Link
          to="/subscriptions"
          className="flex items-center p-4 bg-white ring-1 ring-black/5 rounded-2xl hover:ring-black/10 transition"
        >
          <div
            className={`size-10 rounded-lg grid place-items-center text-xs font-semibold ${colorClass[subsEnv.color].letter}`}
          >
            S
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium">Subscriptions envelope</p>
            <p className="text-xs text-zinc-500">5 active · Auto-funds on the 1st</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-naira">
              {naira(subsEnv.balance, { compact: true })}
            </p>
            <p className="text-[10px] text-zinc-400">Due in 4d</p>
          </div>
        </Link>
      </section>

      <section className="px-6 mt-10 mb-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
            Goals
          </h2>
          <Link to="/goals" className="text-[11px] font-medium text-emerald-deep">
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = Math.min(100, (g.balance / (g.target ?? 1)) * 100);
            return (
              <div
                key={g.id}
                className="bg-emerald-deep text-emerald-50 rounded-2xl p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-emerald-200 uppercase tracking-[0.18em] font-medium">
                      Goal · {g.deadline}
                    </p>
                    <h3 className="text-lg font-medium mt-1">{g.name}</h3>
                  </div>
                  <span className="text-xs font-medium text-emerald-100 bg-white/10 px-2 py-1 rounded-full">
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-emerald-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-200 text-naira">
                    {naira(g.balance, { compact: true })} saved
                  </span>
                  <span className="text-emerald-100 text-naira">
                    of {naira(g.target ?? 0, { compact: true })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PhoneShell>
  );
}

function QuickAction({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-center py-3 text-xs font-medium text-zinc-700 hover:text-emerald-deep transition-colors"
    >
      {label}
    </Link>
  );
}
