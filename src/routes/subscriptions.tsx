import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { NewSubscriptionDialog } from "@/components/swift/NewSubscriptionDialog";
import { naira } from "@/lib/swift-data";
import { useSubscriptions } from "@/lib/hooks/use-subscriptions";

export const Route = createFileRoute("/subscriptions")({
  component: Subs,
  head: () => ({
    meta: [
      { title: "Subscriptions · Swift" },
      {
        name: "description",
        content:
          "Register your recurring subscriptions and let Swift auto-fund them from a dedicated envelope.",
      },
    ],
  }),
});

const statusChip = {
  funded: { label: "Funded", cls: "text-emerald-deep bg-emerald-soft", Icon: CheckCircle2 },
  low: { label: "Low funds", cls: "text-warning bg-warning-soft", Icon: AlertTriangle },
  failed: { label: "Failed", cls: "text-red-700 bg-red-50", Icon: AlertTriangle },
} as const;

function Subs() {
  const { data, isLoading } = useSubscriptions();
  const [newOpen, setNewOpen] = useState(false);
  const subscriptions = data?.subscriptions ?? [];
  const total = data?.totalMonthlyNaira ?? 0;

  return (
    <PhoneShell>
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-600 text-sm">
          <ArrowLeft className="size-4" /> Home
        </Link>
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
          Subscriptions
        </p>
        <button onClick={() => setNewOpen(true)} className="text-zinc-600">
          <Plus className="size-5" />
        </button>
      </div>

      <div className="px-6">
        <div className="bg-emerald-deep text-emerald-50 rounded-2xl p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200 mb-2">
            Monthly total
          </p>
          <h1 className="text-4xl font-medium text-naira">{naira(total)}</h1>
          <div className="mt-5 flex items-center justify-between text-xs">
            <span className="text-emerald-200">
              Envelope funded on the 1st of every month
            </span>
            <span className="text-emerald-100 font-medium">
              {subscriptions.length} active
            </span>
          </div>
          {subscriptions.length > 0 && (
            <Link
              to="/allocate"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-deep bg-emerald-50 px-3 py-1.5 rounded-full"
            >
              Add funds to this envelope
            </Link>
          )}
        </div>
      </div>

      <section className="px-6 mt-8 mb-10">
        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-3">
          Upcoming
        </h3>

        {!isLoading && subscriptions.length === 0 ? (
          <button
            onClick={() => setNewOpen(true)}
            className="w-full bg-white rounded-2xl ring-1 ring-dashed ring-black/10 p-8 text-center text-sm text-zinc-500 hover:ring-black/20 transition"
          >
            No subscriptions yet — add your first one
          </button>
        ) : (
          <ul className="space-y-3">
            {subscriptions.map((s) => {
              const st = statusChip[s.status];
              const Icon = st.Icon;
              return (
                <li
                  key={s.id}
                  className="p-4 bg-white ring-1 ring-black/5 rounded-2xl flex items-center"
                >
                  <div
                    className={
                      "size-10 rounded-lg grid place-items-center text-[13px] font-bold shrink-0 " +
                      s.tintClass
                    }
                  >
                    {s.letter}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-[11px] text-zinc-500">Next bill · {s.nextBill}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-naira">{naira(s.amountNaira)}</p>
                    <span
                      className={
                        "inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 " +
                        st.cls
                      }
                    >
                      <Icon className="size-2.5" />
                      {st.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <NewSubscriptionDialog open={newOpen} onOpenChange={setNewOpen} />
    </PhoneShell>
  );
}
