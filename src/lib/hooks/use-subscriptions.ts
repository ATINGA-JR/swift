import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { colorClass } from "@/lib/swift-data";
import { ENVELOPE_COLORS } from "@/lib/hooks/use-envelopes";

export type SubscriptionView = {
  id: string;
  name: string;
  amountNaira: number;
  nextBill: string;
  status: "funded" | "low" | "failed";
  letter: string;
  tintClass: string;
};

function nextBillDate(billingDay: number): Date {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), billingDay);
  if (thisMonth < now) {
    return new Date(now.getFullYear(), now.getMonth() + 1, billingDay);
  }
  return thisMonth;
}

// Deterministic pick so the same subscription always gets the same tint,
// without needing to store a color column just for this.
function tintFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const color = ENVELOPE_COLORS[hash % ENVELOPE_COLORS.length];
  return colorClass[color].letter;
}

// Every subscription draws from one pooled "Subscriptions" envelope per
// user (type: 'subscription') — matching the PRD's model of a single
// auto-funded envelope with several line items inside it, rather than a
// separate envelope per subscription.
async function ensureSubscriptionEnvelope(userId: string): Promise<string> {
  const { data: existing } = await supabase
    .from("envelopes")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "subscription")
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("envelopes")
    .insert({
      user_id: userId,
      name: "Subscriptions",
      type: "subscription",
      color: "slate",
    })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}

export function useSubscriptions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscriptions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [subsRes, envRes] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("id, name, amount, billing_day, status")
          .eq("user_id", user!.id)
          .order("billing_day", { ascending: true }),
        supabase
          .from("envelopes")
          .select("balance")
          .eq("user_id", user!.id)
          .eq("type", "subscription")
          .maybeSingle(),
      ]);

      if (subsRes.error) throw subsRes.error;
      if (envRes.error) throw envRes.error;

      const poolBalanceKobo = envRes.data?.balance ?? 0;
      const totalMonthlyKobo = subsRes.data
        .filter((s) => s.status === "active")
        .reduce((sum, s) => sum + s.amount, 0);
      const poolCoversTotal = poolBalanceKobo >= totalMonthlyKobo;

      const views: SubscriptionView[] = subsRes.data.map((s) => ({
        id: s.id,
        name: s.name,
        amountNaira: s.amount / 100,
        nextBill: nextBillDate(s.billing_day).toLocaleDateString("en-NG", {
          month: "short",
          day: "numeric",
        }),
        status: s.status === "failed" ? "failed" : poolCoversTotal ? "funded" : "low",
        letter: s.name.charAt(0).toUpperCase(),
        tintClass: tintFor(s.name),
      }));

      return { subscriptions: views, totalMonthlyNaira: totalMonthlyKobo / 100 };
    },
  });
}

type CreateSubscriptionInput = {
  name: string;
  amountNaira: number;
  billingDay: number;
};

export function useCreateSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSubscriptionInput) => {
      const envelopeId = await ensureSubscriptionEnvelope(user!.id);

      const { error } = await supabase.from("subscriptions").insert({
        user_id: user!.id,
        envelope_id: envelopeId,
        name: input.name,
        amount: Math.round(input.amountNaira * 100),
        billing_day: input.billingDay,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["envelopes", user?.id] });
    },
  });
}
