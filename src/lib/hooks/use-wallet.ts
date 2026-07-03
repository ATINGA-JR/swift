import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Wallet balance is stored in kobo (bigint) in Postgres. Every value
// returned here is already converted to naira — nothing downstream should
// divide by 100 again.
export function useWallet() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wallet", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;
      return { balanceNaira: data.balance / 100 };
    },
  });
}

export type ContributionView = {
  id: string;
  amountNaira: number;
  when: string;
};

export function useContributions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["contributions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contributions")
        .select("id, amount, created_at")
        .eq("user_id", user!.id)
        .eq("status", "success")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map(
        (row): ContributionView => ({
          id: row.id,
          amountNaira: row.amount / 100,
          when: new Date(row.created_at).toLocaleString("en-NG", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      );
    },
  });
}
