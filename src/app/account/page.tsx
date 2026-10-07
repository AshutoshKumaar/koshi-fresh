"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";
import { OrderHistory } from "@/components/account/order-history";
import {
  User,
  Mail,
  Package,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Heart,
  HelpCircle,
} from "lucide-react";
import { useShop } from "@/context/shop-context";
import { StorefrontLoading } from "@/components/common/storefront-loading";

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const { setIsWishlistOpen } = useShop();

  // Protect route
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been logged out of your Koshi Fresh account.",
      });
      router.push("/");
    } catch {
      toast({
        title: "Sign Out Error",
        description: "Could not log out at this moment. Please try again.",
        variant: "error",
      });
    }
  };

  if (loading || !user) {
    return <StorefrontLoading fullScreen label="Loading your account and recent orders…" />;
  }

  const customerName = profile?.name || user.displayName || "Valued Member";
  const customerEmail = profile?.email || user.email || "";

  return (
    <div className="pt-16 pb-20 bg-sand/10 min-h-screen md:pt-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory pt-7 md:pt-16 pb-7 md:pb-16 mb-5 md:mb-10">
        <Container>
          <div className="flex flex-row justify-between items-center gap-3 md:gap-6">
            <div className="space-y-2">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> VIP Customer Portal
              </span>
              <h1 className="font-serif text-xl sm:text-4xl font-bold text-white tracking-tight">
                Welcome, {customerName}
              </h1>
              <p className="mt-1 text-[11px] text-ivory/80 sm:text-sm font-light">
                Manage your profile, track active shipments, and view past organic harvests.
              </p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="h-11 shrink-0 border-white/30 px-3 text-white hover:bg-white/10 text-xs font-sans font-medium rounded-xl gap-2 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div id="profile" className="bg-white rounded-3xl border border-sand/60 p-6 shadow-premium-sm space-y-6">
              <div className="flex items-center gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-forest/10 text-forest border border-forest/20 flex items-center justify-center font-serif text-2xl font-bold">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-obsidian">{customerName}</h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full mt-1">
                    <ShieldCheck className="h-3 w-3" /> {user.emailVerified ? "Email Verified" : "Customer Account"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-sand/40 text-xs font-sans">
                <div className="flex items-center gap-2.5 text-charcoal">
                  <Mail className="h-4 w-4 text-stone shrink-0" />
                  <span className="truncate">{customerEmail}</span>
                </div>
                <div className="flex items-center gap-2.5 text-charcoal">
                  <User className="h-4 w-4 text-stone shrink-0" />
                  <span className="text-stone">Account:</span>
                  <span className="font-mono text-[10px] text-stone truncate">{user.emailVerified ? "Verified account" : "Account active"}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-forest hover:bg-forest-light text-white font-sans font-bold text-xs rounded-xl shadow-premium-sm transition-all"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Sourcing Guarantee Box */}
            <div className="p-4 rounded-2xl bg-forest/5 border border-forest/15 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-forest shrink-0 mt-0.5" />
              <div className="text-xs font-sans">
                <span className="font-bold text-forest block mb-0.5">100% Sourcing Authenticity</span>
                <p className="text-stone/80 font-light leading-relaxed">
                  Direct wetland harvesting in Mithilanchal. All batches are NABL lab tested and chemical-free.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Orders & Activity */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            <nav aria-label="Account shortcuts" className="overflow-hidden rounded-2xl border border-sand/60 bg-white shadow-premium-sm lg:hidden">
              <Link href="/account/orders" className="flex min-h-14 items-center gap-3 border-b border-sand/50 px-4 text-sm font-semibold text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest"><Package className="h-5 w-5 text-forest" />My Orders<ChevronRight className="ml-auto h-4 w-4 text-stone" /></Link>
              <button type="button" onClick={() => setIsWishlistOpen(true)} className="flex min-h-14 w-full items-center gap-3 border-b border-sand/50 px-4 text-left text-sm font-semibold text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest"><Heart className="h-5 w-5 text-forest" />Wishlist<ChevronRight className="ml-auto h-4 w-4 text-stone" /></button>
              <Link href="/contact" className="flex min-h-14 items-center gap-3 px-4 text-sm font-semibold text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest"><HelpCircle className="h-5 w-5 text-forest" />Help & Support<ChevronRight className="ml-auto h-4 w-4 text-stone" /></Link>
            </nav>
            {/* Orders Section */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-sand/60 p-4 sm:p-8 shadow-premium-sm space-y-4 md:space-y-6">
              <div className="flex items-center justify-between border-b border-sand/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <Package className="h-5 w-5 text-forest" />
                  <h2 className="font-serif text-xl font-bold text-obsidian">My Orders</h2>
                </div>
                <Link href="/account/orders" className="text-xs font-sans text-forest font-semibold hover:underline">Order history</Link>
              </div>
              <OrderHistory />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
