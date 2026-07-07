import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export type CardView = {
  hasCard: boolean;
  brand?: string;
  maskedNumber?: string;
  expiry?: string;
  status?: string;
};

// Reads whatever fields actually exist on the stored raw Sudo card object,
// defensively — Sudo's exact field naming wasn't confirmed against a real
// response before this was built, so we fall back gracefully rather than
// assume and risk showing "undefined" on screen.
function toCardView(raw: any): CardView {
  if (!raw) return { hasCard: false };

  const last4 = raw.maskedPan?.slice(-4) ?? raw.last4 ?? raw.number?.slice(-4);
  const expiryMonth = raw.expiryMonth ?? raw.expMonth ?? raw.expiry?.month;
  const expiryYear = raw.expiryYear ?? raw.expYear ?? raw.expiry?.year;

  return {
    hasCard: true,
    brand: raw.brand ?? "Card",
    maskedNumber: last4 ? `•••• •••• •••• ${last4}` : undefined,
    expiry:
      expiryMonth && expiryYear
        ? `${String(expiryMonth).padStart(2, "0")}/${String(expiryYear).slice(-2)}`
        : undefined,
    status: raw.status,
  };
}

export function useCard() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["card", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("sudo_card_id, sudo_card_raw")
        .eq("id", user!.id)
        .single();

      if (error) throw error;
      return toCardView(data.sudo_card_raw);
    },
  });
}

export type KycInput = {
  firstName: string;
  lastName: string;
  identityType: "BVN" | "NIN";
  identityNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
};

export type CardTransactionView = {
  id: string;
  merchant: string;
  amountNaira: number;
  when: string;
  status: "approved" | "declined";
};

export function useCardTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["card-transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("card_transactions")
        .select("id, merchant, amount, status, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map(
        (row): CardTransactionView => ({
          id: row.id,
          merchant: row.merchant ?? "Unknown merchant",
          amountNaira: row.amount / 100,
          when: new Date(row.created_at).toLocaleString("en-NG", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: row.status,
        }),
      );
    },
  });
}

export function useIssueCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: KycInput) => {
      const { data, error } = await supabase.functions.invoke("sudo-issue-card", {
        method: "POST",
        body: input,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", user?.id] });
    },
  });
}
