"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useAuth, formatAuthError } from "@/context/auth-context";
import { ShieldCheck, UserPlus, ArrowRight, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";

  const { user, signUp, loading: authLoading } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // If already authenticated, redirect to destination
  React.useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectPath);
    }
  }, [user, authLoading, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(name, email, password);
      toast({
        title: "Account Created! ??",
        description: `Welcome to Koshi Fresh, ${name.trim()}! Your organic journey begins.`,
      });
      router.push(redirectPath);
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-sand/10 min-h-screen flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header Card */}
          <div className="text-center mb-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-sans font-bold uppercase tracking-wider">
              <UserPlus className="h-3.5 w-3.5" /> Join Koshi Fresh Circle
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
              Create an Account
            </h1>
            <p className="text-stone text-xs sm:text-sm font-light leading-relaxed">
              Experience authentic Mithila superfoods, track orders seamlessly, and unlock member privileges.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-sand/60 p-6 sm:p-8 shadow-premium-md space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-feedback-error/10 border border-feedback-error/20 flex items-start gap-3 text-xs text-feedback-error font-sans animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-sans font-medium text-stone block mb-1">
                  Full Name <span className="text-feedback-error">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="bg-sand/15 text-xs h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-stone block mb-1">
                  Email Address <span className="text-feedback-error">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="bg-sand/15 text-xs h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-stone block mb-1">
                  Password (min 6 chars) <span className="text-feedback-error">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="bg-sand/15 text-xs h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-obsidian transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-stone block mb-1">
                  Confirm Password <span className="text-feedback-error">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-type your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="bg-sand/15 text-xs h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-obsidian transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-forest hover:bg-forest-light text-white font-sans font-bold h-12 text-sm rounded-xl shadow-premium-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-sand/50 text-center">
              <p className="text-xs text-stone font-sans">
                Already have an account?{" "}
                <Link
                  href={`/login${redirectPath !== "/account" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
                  className="font-bold text-forest hover:underline"
                >
                  Sign In Here
                </Link>
              </p>
            </div>

            {/* Sourcing Security Note */}
            <div className="p-3.5 rounded-xl bg-forest/5 border border-forest/10 flex items-center gap-2.5 text-[11px] font-sans text-stone">
              <ShieldCheck className="h-4 w-4 text-forest shrink-0" />
              <span>Your personal information is SSL 256-bit encrypted and never shared.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand/10">
          <Loader2 className="h-8 w-8 text-forest animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </React.Suspense>
  );
}
