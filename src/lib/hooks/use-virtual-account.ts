import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type VirtualAccount = {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
};

// Calling this always hits the create-virtual-account Edge Function, which
// is idempotent — it returns the existing account if one's already been
// provisioned, or creates one on first call. So this hook doubles as both
// "fetch" and "ensure it exists" with no extra logic needed here.
export function useVirtualAccount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["virtual-account", user?.id],
    enabled: !!user,
    staleTime: Infinity, // an account number never changes once created
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<VirtualAccount>(
        "create-virtual-account",
        { method: "POST" },
      );
      if (error) throw error;
      return data!;
    },
  });
}
