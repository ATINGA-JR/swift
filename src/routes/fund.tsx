import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, Building2, Check, AlertTriangle } from "lucide-react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { naira } from "@/lib/swift-data";
import { useVirtualAccount } from "@/lib/hooks/use-virtual-account";
import { useContributions } from "@/lib/hooks/use-wallet";

export const Route = createFileRoute("/fund")({
  component: Fund,
  head: () => ({
    meta: [
      { title: "Fund wallet · Swift" },
      { name: "description", content: "Load your Swift wallet via bank transfer." },
    ],
  }),
});

function Fund() {
  const { data: account, isLoading, isError } = useVirtualAccount();
  const { data: contributions } = useContributions();
  const [copied, setCopied] = useState(false);

  function copyNumber() {
    if (!account) return;
    navigator.clipboard.writeText(account.account_number.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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

          {isLoading && (
            <div className="bg-zinc-50 rounded-xl p-4 text-sm text-zinc-500 text-center">
              Setting up your account…
            </div>
          )}

          {isError && (
            <div className="bg-red-50 rounded-xl p-4 flex items-start gap-2 text-sm text-red-700">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <span>Couldn't set up a funding account right now. Try again shortly.</span>
            </div>
          )}

          {account && (
            <div className="bg-emerald-soft/60 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-deep font-semibold">
                  {account.bank_name}
                </p>
                <p className="text-2xl font-medium text-naira mt-1">
                  {account.account_number}
                </p>
                <p className="text-[11px] text-zinc-600 mt-1">{account.account_name}</p>
              </div>
              <button
                onClick={copyNumber}
                className="p-2 rounded-lg bg-white ring-1 ring-emerald-deep/10"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-deep" />
                ) : (
                  <Copy className="size-4 text-emerald-deep" />
                )}
              </button>
            </div>
          )}

          <p className="text-[11px] text-zinc-500 mt-3">
            Funds reflect in seconds via Nomba webhook.
          </p>
        </div>
      </div>

      <section className="px-6 mt-10 mb-10">
        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-3">
          Recent funding
        </h3>
        {!contributions || contributions.length === 0 ? (
          <p className="text-sm text-zinc-500 px-1">No funding yet — transfer to the account above to get started.</p>
        ) : (
          <ul className="divide-y divide-black/5 bg-white ring-1 ring-black/5 rounded-2xl px-4">
            {contributions.map((c) => (
              <li key={c.id} className="py-3.5 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Wallet funding</p>
                  <p className="text-[11px] text-zinc-500">{c.when}</p>
                </div>
                <span className="text-sm font-medium text-emerald-deep text-naira">
                  +{naira(c.amountNaira)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PhoneShell>
  );
}
