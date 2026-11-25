"use client";

import { Camera, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/toast";

export function InstagramFollowButton() {
  return (
    <button
      type="button"
      onClick={() => toast({
        title: "@KoshiFresh Instagram",
        description: "Redirecting to Koshi Fresh official Instagram channel...",
      })}
      className="group inline-flex items-center gap-2 rounded-2xl bg-forest px-8 py-3.5 font-sans text-sm font-bold text-ivory shadow-premium-md transition-all duration-300 hover:bg-forest-light"
    >
      <Camera className="h-4 w-4 text-gold-light" />
      <span>Follow @KoshiFresh on Instagram</span>
      <ExternalLink className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
