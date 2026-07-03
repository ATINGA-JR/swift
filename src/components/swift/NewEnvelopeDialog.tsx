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
import { colorClass, type Envelope, type EnvelopeType } from "@/lib/swift-data";
import { ENVELOPE_COLORS, useCreateEnvelope } from "@/lib/hooks/use-envelopes";
import { cn } from "@/lib/utils";

export function NewEnvelopeDialog({
  open,
  onOpenChange,
  defaultType = "spending",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: EnvelopeType;
}) {
  const createEnvelope = useCreateEnvelope();
  const [name, setName] = useState("");
  const [color, setColor] = useState<Envelope["color"]>("emerald");
  const [target, setTarget] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isGoal = defaultType === "goal";

  function reset() {
    setName("");
    setColor("emerald");
    setTarget("");
    setError(null);
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError("Give it a name");
      return;
    }
    if (isGoal && (!target || Number(target) <= 0)) {
      setError("Set a target amount");
      return;
    }

    try {
      await createEnvelope.mutateAsync({
        name: name.trim(),
        type: defaultType,
        color,
        targetNaira: isGoal ? Number(target) : undefined,
      });
      reset();
      onOpenChange(false);
    } catch {
      setError("Couldn't create that envelope — try again");
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
          <DialogTitle>{isGoal ? "New goal" : "New envelope"}</DialogTitle>
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
              placeholder={isGoal ? "e.g. New Laptop" : "e.g. Groceries"}
              className="mt-1.5"
            />
          </div>

          {isGoal && (
            <div>
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.18em]">
                Target amount (₦)
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="1650000"
                className="mt-1.5"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.18em]">
              Color
            </label>
            <div className="mt-2 flex gap-2">
              {ENVELOPE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-8 rounded-full ring-2 ring-offset-2 transition",
                    colorClass[c].bar,
                    color === c ? "ring-zinc-900" : "ring-transparent",
                  )}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={createEnvelope.isPending}
            className="bg-emerald-deep hover:bg-emerald-deep/90"
          >
            {createEnvelope.isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
