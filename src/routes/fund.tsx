import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Building2, CreditCard, Hash } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { wallet } from "@/lib/swift-data";

export const Route = createFileRoute("/fund")({
  component: Fund,
  head: () => ({
    meta: [
      { title: "Fund wallet · Swift" },
      { name: "description", content: "Load your Swift wallet via bank transfer, card, or USSD." },
    ],
  }),
});

function Fund() {
  return (
    <PhoneShell>
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-600 text-sm">
          <ArrowLeft className="size-4" /> Home
        </Link>
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
          Fund wallet
        </p>
        <span className="w-10" />
      </div>

      <div className="px-6">
        <div className="bg-white ring-1 ring-black/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 rounded-lg bg-emerald-soft text-emerald-deep grid place-items-center">
              <Building2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Your Nomba account</p>
              <p className="text-[11px] text-zinc-500">Transfer from any Nigerian bank</p>
            </div>
          </div>
          <div className="bg-emerald-soft/60 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-deep font-semibold">
                {wallet.virtualAccount.bank}
              </p>
              <p className="text-2xl font-medium text-naira mt-1">
                {wallet.virtualAccount.number}
              </p>
              <p className="text-[11px] text-zinc-600 mt-1">
                {wallet.virtualAccount.accountName}
              </p>
            </div>
            <button className="p-2 rounded-lg bg-white ring-1 ring-emerald-deep/10">
              <Copy className="size-4 text-emerald-deep" />
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 mt-3">
            Funds reflect in seconds via Nomba webhook.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="bg-white ring-1 ring-black/5 rounded-2xl p-5 text-left">
            <CreditCard className="size-5 text-emerald-deep" />
            <p className="text-sm font-medium mt-3">Debit card</p>
            <p className="text-[11px] text-zinc-500">Verve · Visa · MC</p>
          </button>
          <button className="bg-white ring-1 ring-black/5 rounded-2xl p-5 text-left">
            <Hash className="size-5 text-emerald-deep" />
            <p className="text-sm font-medium mt-3">USSD</p>
            <p className="text-[11px] text-zinc-500">*737# · *966# · *894#</p>
          </button>
        </div>
      </div>

      <section className="px-6 mt-10 mb-10">
        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-3">
          Recent funding
        </h3>
        <ul className="divide-y divide-black/5 bg-white ring-1 ring-black/5 rounded-2xl px-4">
          <li className="py-3.5 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">GTBank transfer</p>
              <p className="text-[11px] text-zinc-500">Jul 1, 09:04</p>
            </div>
            <span className="text-sm font-medium text-emerald-deep text-naira">
              +₦450,000
            </span>
          </li>
          <li className="py-3.5 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">OPay transfer</p>
              <p className="text-[11px] text-zinc-500">Jun 24, 18:22</p>
            </div>
            <span className="text-sm font-medium text-emerald-deep text-naira">
              +₦120,000
            </span>
          </li>
        </ul>
      </section>
    </PhoneShell>
  );
}