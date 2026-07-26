import type { Metadata } from "next";
import { Mooli, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const mooli = Mooli({
  variable: "--font-mooli",
  subsets: ["latin"],
  weight: ["400"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import { ShopProvider } from "@/context/shop-context";
import { LayoutWrapper } from "@/components/common/layout-wrapper";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Koshi Fresh | Premium Healthy Foods & Organic Makhana",
  description: "Sourced sustainably straight from the wetlands of Mithila, Bihar. Premium Raw and Roasted Makhana, Dry Fruits, Seeds, and organic superfoods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mooli.variable} ${plusJakartaSans.variable} antialiased font-sans`}
      >
        <ShopProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </ShopProvider>
      </body>
    </html>
  );
}
