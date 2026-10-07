"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, formatAuthError } from "@/context/auth-context";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const validateAdminSession = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("Sign-in could not be completed. Please try again.");
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch("/api/admin/session", {
      headers: { Authorization: `Bearer ${idToken}` },
      cache: "no-store",
    });
    if (response.ok) {
      router.replace("/admin/orders");
      return;
    }
    if (response.status === 403) throw new Error("This account does not have admin access. Use the designated admin account.");
    if (response.status === 401) throw new Error("Sign-in could not be verified. Please sign in again.");
    throw new Error("Admin access is temporarily unavailable. Please try again shortly.");
  };

  React.useEffect(() => {
    if (!authLoading && auth.currentUser) {
      void validateAdminSession().catch(() => {
        // Keep the dedicated admin sign-in form visible for non-admin sessions.
      });
    }
  // Validate a session restored by Firebase when this route opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
      await validateAdminSession();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : formatAuthError(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f3f5f1] px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-[28px] border border-sand/70 bg-white shadow-[0_24px_70px_rgba(16,52,40,0.12)]">
        <div className="bg-forest px-7 py-8 text-white sm:px-9">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20"><ShieldCheck className="h-6 w-6" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">Koshi Fresh · Private</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">Admin login</h1>
          <p className="mt-2 text-sm leading-6 text-white/75">Sign in with an authorized administrator account to manage orders.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-9">
          {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
          <label className="block space-y-1.5 text-sm font-semibold text-charcoal">Admin email
            <Input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} placeholder="Enter admin email" className="h-12 rounded-xl bg-white text-base" />
          </label>
          <label className="block space-y-1.5 text-sm font-semibold text-charcoal">Password
            <span className="relative block">
              <Input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} placeholder="Enter password" className="h-12 rounded-xl bg-white pr-12 text-base" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </span>
          </label>
          <Button type="submit" disabled={busy || authLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest text-sm font-bold text-white hover:bg-forest-light disabled:opacity-60">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying admin access…</> : <><LockKeyhole className="h-4 w-4" /> Sign in to admin</>}
          </Button>
          <p className="text-center text-xs leading-5 text-stone">This portal is restricted to authorized administrators. Customer accounts cannot access order management.</p>
        </form>
      </section>
    </main>
  );
}
