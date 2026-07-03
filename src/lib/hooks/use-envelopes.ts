import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Envelope, EnvelopeType } from "@/lib/swift-data";

export const ENVELOPE_COLORS: Envelope["color"][] = [
  "emerald",
  "clay",
  "slate",
  "warning",
  "sage",
];

type DbEnvelope = {
  id: string;
  name: string;
  type: EnvelopeType;
  balance: number; // kobo
  allocated: number; // kobo
  target_amount: number | null; // kobo
  deadline: string | null;
  color: string;
};

function toViewEnvelope(row: DbEnvelope, activeId: string | null): Envelope {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: row.balance / 100,
    allocated: row.allocated / 100,
    target: row.target_amount != null ? row.target_amount / 100 : undefined,
    deadline: row.deadline ?? undefined,
    color: (row.color as Envelope["color"]) ?? "slate",
    letter: row.name.charAt(0).toUpperCase(),
    active: row.id === activeId,
  };
}

// Fetches every envelope for the current user, plus which one is active,
// and returns them already mapped into the view shape swift-data.ts used
// to export as mock data.
export function useEnvelopes() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["envelopes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [envelopesRes, activeRes] = await Promise.all([
        supabase
          .from("envelopes")
          .select(
            "id, name, type, balance, allocated, target_amount, deadline, color",
          )
          .eq("user_id", user!.id)
          .neq("status", "archived")
          .order("created_at", { ascending: true }),
        supabase
          .from("active_envelope")
          .select("envelope_id")
          .eq("user_id", user!.id)
          .maybeSingle(),
      ]);

      if (envelopesRes.error) throw envelopesRes.error;
      if (activeRes.error) throw activeRes.error;

      const activeId = activeRes.data?.envelope_id ?? null;
      return (envelopesRes.data as DbEnvelope[]).map((row) =>
        toViewEnvelope(row, activeId),
      );
    },
  });
}

export function useSetActiveEnvelope() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (envelopeId: string) => {
      const { error } = await supabase.from("active_envelope").upsert({
        user_id: user!.id,
        envelope_id: envelopeId,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envelopes", user?.id] });
    },
  });
}
  name: string;
  type: EnvelopeType;
  color: Envelope["color"];
  targetNaira?: number;
  deadline?: string;
};

export function useCreateEnvelope() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEnvelopeInput) => {
      const { data, error } = await supabase
        .from("envelopes")
        .insert({
          user_id: user!.id,
          name: input.name,
          type: input.type,
          color: input.color,
          target_amount:
            input.targetNaira != null ? Math.round(input.targetNaira * 100) : null,
          deadline: input.deadline ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envelopes", user?.id] });
    },
  });
}
