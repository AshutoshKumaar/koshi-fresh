"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { OrderHistory } from "@/components/account/order-history";
import { useAuth } from "@/context/auth-context";
import { Package } from "lucide-react";
import { StorefrontLoading } from "@/components/common/storefront-loading";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  React.useEffect(() => { if (!loading && !user) router.replace("/login?redirect=/account/orders"); }, [loading, user, router]);
  if (loading || !user) return <StorefrontLoading fullScreen label="Loading your account and order history…" />;
  return <main className="min-h-screen bg-sand/10 pt-20 pb-8 md:pt-28 md:pb-20"><Container><section className="mx-auto max-w-3xl rounded-2xl md:rounded-3xl border border-sand/60 bg-white p-3 sm:p-5 md:p-8 shadow-premium-sm"><div className="mb-4 flex items-center gap-3 border-b border-sand/50 pb-3 md:mb-6 md:pb-4"><Package className="h-5 w-5 text-forest" /><h1 className="font-serif text-xl md:text-2xl font-bold text-obsidian">My Orders</h1></div><OrderHistory /></section></Container></main>;
}
