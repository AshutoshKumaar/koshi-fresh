"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PackageSearch, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { StorefrontLoading } from "@/components/common/storefront-loading";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/admin/login");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#f6f7f4] text-obsidian">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sand/70 bg-white lg:flex">
        <Link href="/admin/orders" className="flex h-20 items-center gap-3 border-b border-sand/60 px-6" aria-label="Koshi Fresh Admin home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-white"><ShieldCheck className="h-5 w-5" /></span>
          <span><span className="block font-serif text-lg font-bold text-forest">Koshi Fresh</span><span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone">Admin workspace</span></span>
        </Link>
        <nav aria-label="Admin navigation" className="flex-1 space-y-2 p-4">
          <Link href="/admin/orders" className="flex min-h-12 items-center gap-3 rounded-xl bg-forest/10 px-4 text-sm font-semibold text-forest" aria-current="page">
            <PackageSearch className="h-5 w-5" /> Orders
          </Link>
        </nav>
        <div className="border-t border-sand/60 p-4">
          <button type="button" onClick={() => void handleSignOut()} disabled={signingOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-semibold text-stone hover:bg-sand/40 hover:text-obsidian disabled:opacity-60">
            <LogOut className="h-4 w-4" /> {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-sand/70 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Link href="/admin/orders" className="flex items-center gap-2 font-serif font-bold text-forest"><ShieldCheck className="h-5 w-5" /> Koshi Fresh <span className="font-sans text-xs font-medium text-stone">Admin</span></Link>
        <button type="button" onClick={() => void handleSignOut()} disabled={signingOut} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-stone hover:bg-sand/40 disabled:opacity-60" aria-label="Sign out of admin">
          <LogOut className="h-4 w-4" /> <span>{signingOut ? "Signing out…" : "Sign out"}</span>
        </button>
      </header>
      <div className="min-h-dvh lg:pl-64">
        <header className="hidden h-16 items-center justify-between border-b border-sand/60 bg-white px-8 lg:flex">
          <p className="text-sm font-semibold text-charcoal">Order operations</p>
          <span className="rounded-full bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest">Admin access verified</span>
        </header>
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [allowed, setAllowed] = React.useState(false);
  const [checking, setChecking] = React.useState(!isLogin);
  const [denied, setDenied] = React.useState(false);

  React.useEffect(() => {
    if (isLogin) {
      setChecking(false);
      return;
    }
    if (loading) return;
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    let active = true;
    setChecking(true);
    void (async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/admin/session", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (!active) return;
        setAllowed(response.ok);
        setDenied(response.status === 403);
      } catch {
        if (active) setDenied(true);
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => { active = false; };
  }, [isLogin, loading, user, router]);

  if (isLogin) return <>{children}</>;
  if (loading || checking) return <StorefrontLoading fullScreen label="Verifying secure account access…" />;
  if (!allowed) return <main className="flex min-h-dvh items-center justify-center bg-[#f6f7f4] px-4 py-16"><section className="w-full max-w-lg rounded-3xl border border-sand/70 bg-white p-8 text-center shadow-premium-sm"><ShieldCheck className="mx-auto h-10 w-10 text-forest" /><h1 className="mt-4 font-serif text-2xl font-bold text-obsidian">Admin access required</h1><p className="mt-2 text-sm leading-6 text-stone">{denied ? "This account is not authorized to manage orders." : "Please sign in with an authorized admin account."}</p><Link href="/admin/login" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-forest px-5 text-sm font-bold text-white">Admin login</Link></section></main>;
  return <AdminShell>{children}</AdminShell>;
}
