import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { CardSetupForm } from "@/components/swift/CardSetupForm";
import { naira } from "@/lib/swift-data";
import { useEnvelopes } from "@/lib/hooks/use-envelopes";
import { useCard, useCardTransactions } from "@/lib/hooks/use-card";

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
  const { data: card, isLoading: cardLoading, refetch } = useCard();
  const { data: envelopes } = useEnvelopes();
  const { data: transactions } = useCardTransactions();
  const active = envelopes?.find((e) => e.active);

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

      {cardLoading ? (
        <div className="px-6 text-sm text-zinc-500 text-center py-10">Loading…</div>
      ) : !card?.hasCard ? (
        <div className="px-6">
          <CardSetupForm onIssued={() => refetch()} />
        </div>
      ) : (
        <>
          <div className="px-6">
            <div className="aspect-[1.586/1] rounded-[20px] p-6 text-zinc-50 relative overflow-hidden flex flex-col justify-between shadow-xl bg-gradient-to-br from-emerald-deep via-zinc-950 to-zinc-950">
              <div className="absolute -top-14 -right-14 size-40 bg-emerald-400/15 blur-3xl rounded-full" />
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-medium tracking-[0.22em] opacity-70">
                  SWIFT · VIRTUAL
                </span>
                <div className="text-[10px] font-medium uppercase tracking-wider bg-white/10 ring-1 ring-white/15 px-2 py-1 rounded-full">
                  {card.brand}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-lg tracking-[0.2em] text-naira">
                  {card.maskedNumber ?? "Card issued"}
                </div>
                <div className="flex gap-8 text-[10px] font-medium uppercase opacity-70">
                  {card.expiry && (
                    <div>
                      <p>Expiry</p>
                      <p className="text-zinc-50 text-sm mt-0.5 tracking-wide">{card.expiry}</p>
                    </div>
                  )}
                  <div>
                    <p>Status</p>
                    <p className="text-zinc-50 text-sm mt-0.5 tracking-wide capitalize">
                      {card.status ?? "Active"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/decline"
              className="mt-4 block bg-white ring-1 ring-black/5 rounded-xl py-3 text-center text-[11px] font-medium text-warning"
            >
              Demo a decline
            </Link>
          </div>

          <section className="px-6 mt-8">
            <div className="bg-white ring-1 ring-black/5 rounded-2xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
                    Active envelope
                  </p>
                  {active ? (
                    <>
                      <p className="text-base font-medium mt-1">{active.name}</p>
                      <p className="text-xs text-zinc-500 text-naira">
                        {naira(active.balance)} available
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-zinc-500 mt-1">
                      None set — the card will decline everything until you activate one.
                    </p>
                  )}
                </div>
                {active && (
                  <Link
                    to="/envelope/$id"
                    params={{ id: active.id }}
                    className="text-xs font-medium text-emerald-deep bg-emerald-soft px-3 py-1.5 rounded-full ring-1 ring-emerald-deep/10 inline-flex items-center gap-1.5"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-mid" />
                    Switch
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section className="px-6 mt-8 mb-10">
            <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-3">
              Card activity
            </h3>
            {!transactions || transactions.length === 0 ? (
              <p className="text-sm text-zinc-500">No card activity yet.</p>
            ) : (
              <ul className="divide-y divide-black/5 bg-white ring-1 ring-black/5 rounded-2xl px-4">
                {transactions.map((t) => (
                  <li key={t.id} className="py-3.5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{t.merchant}</p>
                      <p className="text-[11px] text-zinc-500">{t.when}</p>
                    </div>
                    <span
                      className={
                        "text-sm font-medium text-naira " +
                        (t.status === "declined" ? "text-warning" : "")
                      }
                    >
                      {t.status === "declined" ? "Declined · " : "−"}
                      {naira(t.amountNaira)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </PhoneShell>
  );
}
