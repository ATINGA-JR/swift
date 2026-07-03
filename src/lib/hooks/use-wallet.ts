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
