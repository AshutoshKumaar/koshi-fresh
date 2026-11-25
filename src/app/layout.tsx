import type { Metadata } from "next";
import { Mooli } from "next/font/google";
import "./globals.css";

const mooli = Mooli({
  variable: "--font-mooli",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

import { AuthProvider } from "@/context/auth-context";
import { ShopProvider } from "@/context/shop-context";
import { LayoutWrapper } from "@/components/common/layout-wrapper";
import { Footer } from "@/components/common/footer";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Koshi Fresh | Premium Healthy Foods & Organic Makhana",
  description: "Sourced sustainably straight from the wetlands of Mithila, Bihar. Premium Raw and Roasted Makhana, Dry Fruits, Seeds, and organic superfoods.",
  icons: {
    icon: "/favicon-icon-optimized.png",
    shortcut: "/favicon-icon-optimized.png",
    apple: "/favicon-icon-optimized.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mooli.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <ShopProvider>
            <LayoutWrapper footer={<Footer />}>
              {children}
            </LayoutWrapper>
            <Toaster />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
