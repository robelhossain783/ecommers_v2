import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "BuyFest",
  description:
    "Apple Gadgets is one of the biggest tech retail chains in Bangladesh. Shop the latest gadgets, devices, and smart electronics and get fast delivery.",
  keywords: "iPhone Bangladesh, MacBook Bangladesh, Samsung Galaxy, gadgets BD, Apple Gadgets",
  openGraph: {
    title: "Smartphones, Gadgets & Premium Accessories | Apple Gadgets BD",
    description: "Bangladesh's trusted store for premium gadgets and electronics.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
