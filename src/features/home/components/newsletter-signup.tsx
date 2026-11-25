"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    toast({
      variant: "success",
      title: "Successfully Joined",
      description: "Welcome to Koshi Fresh inner circle. Check your inbox for wellness guides.",
    });
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 pt-4 sm:flex-row">
      <Input
        type="email"
        placeholder="Enter your email address..."
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className="h-12 rounded-xl border-white/25 bg-white/15 font-sans text-sm text-white placeholder:text-white/60 backdrop-blur-md hover:border-white/40 focus:border-white"
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="h-12 shrink-0 cursor-pointer rounded-xl bg-gradient-to-r from-gold-light via-gold to-amber-500 px-7 font-sans font-bold text-obsidian shadow-premium-md hover:from-amber-400 hover:to-gold"
      >
        Claim 15% OFF
      </Button>
    </form>
  );
}
