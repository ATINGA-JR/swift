export type EnvelopeType = "spending" | "goal" | "subscription";

export type Envelope = {
  id: string;
  name: string;
  type: EnvelopeType;
  balance: number;
  allocated: number;
  target?: number;
  deadline?: string;
  color: "emerald" | "clay" | "slate" | "warning" | "sage";
  letter: string;
  active?: boolean;
};

export type Txn = {
  id: string;
  envelopeId: string;
  merchant: string;
  amount: number;
  when: string;
  status: "approved" | "declined";
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  nextBill: string;
  status: "funded" | "low" | "scheduled" | "failed";
  letter: string;
  tint: "red" | "blue" | "green" | "amber" | "violet" | "sky";
};

export const wallet = {
  total: 1420500,
  available: 45000,
  virtualAccount: {
    bank: "Nomba MFB",
    number: "8130 5521 09",
    accountName: "SWIFT / Adaeze Okoro",
  },
};

export const envelopes: Envelope[] = [
  {
    id: "feeding",
    name: "Feeding",
    type: "spending",
    balance: 84200,
    allocated: 120000,
    color: "emerald",
    letter: "F",
    active: true,
  },
  {
    id: "transport",
    name: "Transport",
    type: "spending",
    balance: 12500,
    allocated: 40000,
    color: "clay",
    letter: "T",
  },
  {
    id: "data",
    name: "MTN Data",
    type: "spending",
    balance: 5200,
    allocated: 15000,
    color: "slate",
    letter: "M",
  },
  {
    id: "fun",
    name: "Weekend Fun",
    type: "spending",
    balance: 22800,
    allocated: 50000,
    color: "sage",
    letter: "W",
  },
  {
    id: "rent",
    name: "Rent",
    type: "spending",
    balance: 650000,
    allocated: 650000,
    color: "emerald",
    letter: "R",
  },
  {
    id: "subs",
    name: "Subscriptions",
    type: "subscription",
    balance: 65800,
    allocated: 65800,
    color: "slate",
    letter: "S",
  },
];

export const goals: Envelope[] = [
  {
    id: "macbook",
    name: "MacBook Air M3",
    type: "goal",
    balance: 480000,
    allocated: 480000,
    target: 1650000,
    deadline: "Dec 2026",
    color: "emerald",
    letter: "M",
  },
  {
    id: "japan",
    name: "Japan Trip",
    type: "goal",
    balance: 220000,
    allocated: 220000,
    target: 2400000,
    deadline: "Mar 2027",
    color: "clay",
    letter: "J",
  },
];

export const txns: Txn[] = [
  {
    id: "t1",
    envelopeId: "feeding",
    merchant: "The Place Restaurant",
    amount: 8500,
    when: "Yesterday, 14:20",
    status: "approved",
  },
  {
    id: "t2",
    envelopeId: "feeding",
    merchant: "Glovo Delivery",
    amount: 4200,
    when: "Monday, 19:45",
    status: "approved",
  },
  {
    id: "t3",
    envelopeId: "feeding",
    merchant: "Shoprite Ikeja",
    amount: 14200,
    when: "Oct 12, 11:04",
    status: "approved",
  },
  {
    id: "t4",
    envelopeId: "feeding",
    merchant: "Mama Cass",
    amount: 3800,
    when: "Oct 10, 13:32",
    status: "approved",
  },
  {
    id: "t5",
    envelopeId: "transport",
    merchant: "Bolt Ride",
    amount: 2900,
    when: "Today, 08:10",
    status: "approved",
  },
];

export const subscriptions: Subscription[] = [
  {
    id: "netflix",
    name: "Netflix Premium",
    amount: 7000,
    nextBill: "Jul 12",
    status: "funded",
    letter: "N",
    tint: "red",
  },
  {
    id: "dstv",
    name: "DSTV Compact",
    amount: 15700,
    nextBill: "Jul 15",
    status: "low",
    letter: "D",
    tint: "blue",
  },
  {
    id: "spotify",
    name: "Spotify Family",
    amount: 2900,
    nextBill: "Jul 18",
    status: "funded",
    letter: "S",
    tint: "green",
  },
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    amount: 16000,
    nextBill: "Jul 20",
    status: "scheduled",
    letter: "G",
    tint: "violet",
  },
  {
    id: "linkedin",
    name: "LinkedIn Premium",
    amount: 24200,
    nextBill: "Jul 24",
    status: "scheduled",
    letter: "in",
    tint: "sky",
  },
];

export function naira(n: number, { compact = false }: { compact?: boolean } = {}) {
  if (compact && n >= 1_000_000)
    return `₦${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (compact && n >= 1_000)
    return `₦${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
  return `₦${n.toLocaleString("en-NG")}`;
}

export function envelopeById(id: string) {
  return [...envelopes, ...goals].find((e) => e.id === id);
}

export const colorClass: Record<Envelope["color"], { bar: string; chip: string; letter: string }> = {
  emerald: {
    bar: "bg-emerald-deep",
    chip: "bg-emerald-soft text-emerald-deep",
    letter: "bg-emerald-soft text-emerald-deep",
  },
  clay: {
    bar: "bg-clay",
    chip: "bg-clay-soft text-clay",
    letter: "bg-clay-soft text-clay",
  },
  slate: {
    bar: "bg-zinc-700",
    chip: "bg-zinc-100 text-zinc-800",
    letter: "bg-zinc-100 text-zinc-800",
  },
  warning: {
    bar: "bg-warning",
    chip: "bg-warning-soft text-warning",
    letter: "bg-warning-soft text-warning",
  },
  sage: {
    bar: "bg-emerald-mid",
    chip: "bg-emerald-soft text-emerald-deep",
    letter: "bg-emerald-soft text-emerald-deep",
  },
};

export const subTint: Record<Subscription["tint"], string> = {
  red: "bg-red-600 text-white",
  blue: "bg-blue-900 text-white",
  green: "bg-green-600 text-white",
  amber: "bg-amber-500 text-white",
  violet: "bg-violet-700 text-white",
  sky: "bg-sky-700 text-white",
};