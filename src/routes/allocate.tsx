import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { colorClass, naira } from "@/lib/swift-data";
import { useWallet } from "@/lib/hooks/use-wallet";
import { useAllocateFromWallet, useEnvelopes } from "@/lib/hooks/use-envelopes";

export const Route = createFileRoute("/allocate")({
  component: Allocate,
  head: () => ({
    meta: [
      { title: "Allocate · Swift" },
      { name: "description", content: "Distribute your available balance across envelopes." },
    ],
  }),
});

function Allocate() {
  const navigate = useNavigate();
  const { data: wallet } = useWallet();
  const { data: envelopes, isLoading } = useEnvelopes();
  const allocate = useAllocateFromWallet();

  const spending = (envelopes ?? []).filter((e) => e.type === "spending");
  const assignedTotal = (envelopes ?? []).reduce((sum, e) => sum + e.balance, 0);
  const walletAvailable = Math.max(0, (wallet?.balanceNaira ?? 0) - assignedTotal);

  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const assigned = Object.values(amounts).reduce((s, x) => s + (x || 0), 0);
  const remaining = walletAvailable - assigned;

  async function handleAssign() {
    setError(null);
    try {
      await allocate.mutateAsync(
        Object.entries(amounts).map(([envelopeId, amountNaira]) => ({
          envelopeId,
          amountNaira,
        })),
      );
      navigate({ to: "/" });
    } catch {
      setError("Couldn't complete that allocation — try again");
    }
  }

  return (
    <PhoneShell>
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-600 text-sm">
          <ArrowLeft className="size-4" /> Home
        </Link>
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
          Allocate
        </p>
        <span className="w-10" />
      </div>

      <div className="px-6">
        <div className="bg-zinc-950 text-zinc-50 rounded-2xl p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 mb-2">
            Available to assign
          </p>
          <h1
            className={
              "text-4xl font-medium text-naira " +
              (remaining < 0 ? "text-warning" : "")
            }
          >
            {naira(remaining)}
          </h1>
          <p className="text-xs text-zinc-500 mt-2 text-naira">
            of {naira(walletAvailable)}
          </p>
        </div>
      </div>

      <section className="px-6 mt-6 space-y-2 mb-6">
        {!isLoading && spending.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-8">
            No envelopes yet — create one from the dashboard first.
          </p>
        )}
        {spending.map((e) => (
          <div
            key={e.id}
            className="bg-white ring-1 ring-black/5 rounded-2xl p-4 flex items-center gap-3"
          >
            <div
              className={
                "size-10 rounded-lg grid place-items-center text-xs font-semibold " +
                colorClass[e.color].letter
              }
            >
              {e.letter}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{e.name}</p>
              <p className="text-[11px] text-zinc-500 text-naira">
                Current {naira(e.balance)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-zinc-400">₦</span>
              <input
                inputMode="numeric"
                placeholder="0"
                value={amounts[e.id] ?? ""}
                onChange={(ev) =>
                  setAmounts((a) => ({
                    ...a,
                    [e.id]: Number(ev.target.value.replace(/\D/g, "")) || 0,
                  }))
                }
                className="w-20 bg-transparent border-b border-zinc-200 focus:border-emerald-deep focus:outline-none text-right text-naira font-medium py-1"
              />
            </div>
          </div>
        ))}
      </section>

      {error && (
        <p className="px-6 text-sm text-red-500 mb-4 text-center">{error}</p>
      )}

      <div className="px-6 mb-8">
        <button
          onClick={handleAssign}
          disabled={remaining < 0 || assigned === 0 || allocate.isPending}
          className="w-full bg-emerald-deep hover:bg-emerald-mid disabled:opacity-40 disabled:hover:bg-emerald-deep transition text-emerald-50 py-4 rounded-xl text-sm font-medium"
        >
          {allocate.isPending
            ? "Assigning…"
            : `Assign ${assigned > 0 ? naira(assigned) : ""} to envelopes`}
        </button>
      </div>
    </PhoneShell>
  );
}
