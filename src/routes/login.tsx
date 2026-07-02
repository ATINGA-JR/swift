import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneShell } from "@/components/swift/PhoneShell";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: Login,
});

// Accepts local NG formats (080..., 070..., etc) or already-international
// (+234..., 234...) and normalizes to E.164 (+234XXXXXXXXXX).
function toE164Nigeria(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^\+234\d{10}$/.test(digits)) return digits;
  if (/^234\d{10}$/.test(digits)) return `+${digits}`;
  if (/^0\d{10}$/.test(digits)) return `+234${digits.slice(1)}`;
  if (/^\d{10}$/.test(digits)) return `+234${digits}`;
  return null;
}

function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [e164Phone, setE164Phone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/" });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  function startCooldown() {
    setCooldown(60);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1 && cooldownRef.current) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = toE164Nigeria(phoneInput);
    if (!normalized) {
      setError("Enter a valid Nigerian phone number, e.g. 0801 234 5678");
      return;
    }

    setSubmitting(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: normalized,
    });
    setSubmitting(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setE164Phone(normalized);
    setStep("otp");
    startCooldown();
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }

    setSubmitting(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: e164Phone,
      token: otp,
      type: "sms",
    });
    setSubmitting(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    navigate({ to: "/" });
  }

  async function resend() {
    if (cooldown > 0) return;
    setError(null);
    setSubmitting(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: e164Phone,
    });
    setSubmitting(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    startCooldown();
  }

  return (
    <PhoneShell dark hideNav>
      <div className="min-h-screen flex flex-col justify-center px-6 py-12 text-zinc-50">
        <div className="mb-10">
          <h1 className="text-2xl font-medium">Swift</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {step === "phone"
              ? "Your money, in its lane. Enter your phone number to continue."
              : `We sent a 6-digit code to ${e164Phone}`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.18em]">
                Phone number
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoFocus
                placeholder="080X XXX XXXX"
                value={phoneInput}
                onChange={(ev) => setPhoneInput(ev.target.value)}
                className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-emerald-500/50 outline-none px-4 py-3 text-base text-zinc-50 placeholder:text-zinc-600"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
            >
              {submitting ? "Sending code…" : "Send code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2 justify-center w-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-12 w-11 rounded-xl border-white/10 bg-white/5 text-zinc-50 text-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
            >
              {submitting ? "Verifying…" : "Verify & continue"}
            </Button>
            <div className="text-center text-xs text-zinc-500">
              {cooldown > 0 ? (
                <span>Resend code in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={resend}
                  className="text-emerald-400 font-medium"
                >
                  Resend code
                </button>
              )}
              <span className="mx-2">·</span>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError(null);
                }}
                className="text-zinc-400"
              >
                Change number
              </button>
            </div>
          </form>
        )}
      </div>
    </PhoneShell>
  );
}
