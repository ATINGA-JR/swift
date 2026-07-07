import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateSubscription } from "@/lib/hooks/use-subscriptions";

export function NewSubscriptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createSubscription = useCreateSubscription();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingDay, setBillingDay] = useState("1");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setAmount("");
    setBillingDay("1");
    setError(null);
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError("Give it a name");
      return;
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Enter an amount");
      return;
    }
    const day = Number(billingDay);
    if (!day || day < 1 || day > 31) {
      setError("Billing day must be between 1 and 31");
      return;
    }

    try {
      await createSubscription.mutateAsync({
        name: name.trim(),
        amountNaira: amt,
        billingDay: day,
      });
      reset();
      onOpenChange(false);
    } catch {
      setError("Couldn't add that subscription — try again");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>New subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.18em]">
              Name
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Netflix"
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.18em]">
                Amount (₦)
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="4400"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.18em]">
                Billing day
              </label>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                max={31}
                value={billingDay}
                onChange={(e) => setBillingDay(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={createSubscription.isPending}
            className="bg-emerald-deep hover:bg-emerald-deep/90"
          >
            {createSubscription.isPending ? "Adding…" : "Add subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
