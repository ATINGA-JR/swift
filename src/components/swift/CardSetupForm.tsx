import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIssueCard } from "@/lib/hooks/use-card";

const NG_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export function CardSetupForm({ onIssued }: { onIssued: () => void }) {
  const issueCard = useIssueCard();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    identityType: "BVN" as "BVN" | "NIN",
    identityNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Lagos",
    postalCode: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    setError(null);
    if (
      !form.firstName ||
      !form.lastName ||
      !form.identityNumber ||
      !form.addressLine1 ||
      !form.city ||
      !form.postalCode
    ) {
      setError("Fill in all required fields");
      return;
    }

    try {
      await issueCard.mutateAsync(form);
      onIssued();
    } catch {
      setError("Couldn't issue your card — check the details and try again");
    }
  }

  return (
    <div className="bg-white ring-1 ring-black/5 rounded-2xl p-5 space-y-5">
      <div>
        <p className="text-sm font-medium">Verify your identity</p>
        <p className="text-xs text-zinc-500 mt-1">
          Required once to issue your Swift virtual card.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="First name">
          <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        </Field>
        <Field label="Last name">
          <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-[100px_1fr] gap-3">
        <Field label="ID type">
          <select
            value={form.identityType}
            onChange={(e) => set("identityType", e.target.value as "BVN" | "NIN")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm md:text-sm"
          >
            <option value="BVN">BVN</option>
            <option value="NIN">NIN</option>
          </select>
        </Field>
        <Field label={`${form.identityType} number`}>
          <Input
            inputMode="numeric"
            value={form.identityNumber}
            onChange={(e) => set("identityNumber", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Address line 1">
        <Input value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} />
      </Field>
      <Field label="Address line 2 (optional)">
        <Input value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="City">
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="State">
          <select
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm md:text-sm"
          >
            {NG_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Postal code">
        <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
      </Field>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={issueCard.isPending}
        className="w-full bg-emerald-deep hover:bg-emerald-deep/90"
      >
        {issueCard.isPending ? "Issuing card…" : "Issue my card"}
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.14em]">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
