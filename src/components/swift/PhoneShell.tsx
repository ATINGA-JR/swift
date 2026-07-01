import { Link, useLocation } from "@tanstack/react-router";
import { Home, CreditCard, Repeat, Target } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/card", label: "Card", icon: CreditCard },
  { to: "/subscriptions", label: "Bills", icon: Repeat },
  { to: "/goals", label: "Goals", icon: Target },
] as const;

export function PhoneShell({
  children,
  dark = false,
  hideNav = false,
}: {
  children: ReactNode;
  dark?: boolean;
  hideNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-zinc-200/60 flex justify-center py-6 sm:py-10 px-4">
      <div
        className={
          "w-full max-w-[420px] rounded-[36px] shadow-[0_30px_80px_-30px_rgba(15,23,18,0.45)] ring-1 ring-black/5 overflow-hidden relative " +
          (dark ? "bg-zinc-950" : "bg-paper")
        }
      >
        {children}
        {!hideNav && <BottomNav dark={dark} />}
      </div>
    </div>
  );
}

function BottomNav({ dark }: { dark: boolean }) {
  const location = useLocation();
  return (
    <nav
      className={
        "sticky bottom-0 inset-x-0 px-4 pt-3 pb-6 border-t " +
        (dark
          ? "bg-zinc-950/95 backdrop-blur border-white/5"
          : "bg-paper/95 backdrop-blur border-black/5")
      }
    >
      <ul className="flex items-center justify-between">
        {tabs.map((t) => {
          const active = location.pathname === t.to;
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                className={
                  "flex flex-col items-center gap-1 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors " +
                  (active
                    ? dark
                      ? "text-emerald-300"
                      : "text-emerald-deep"
                    : dark
                      ? "text-zinc-500"
                      : "text-zinc-400")
                }
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}