import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

import NotificationBanner from "@/components/sections/NotificationBanner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#222222",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ryorbd.vercel.app"),

  title: {
    default: "Ryor - Online Shopping in Bangladesh",
    template: "%s | Ryor",
  },

  description:
    "Ryor is your trusted online shopping destination in Bangladesh. Shop fashion, beauty, electronics, home essentials, gadgets, and more at the best prices with fast delivery nationwide.",

  keywords: [
    "Ryor",
    "Ryor Bangladesh",
    "Ryor BD",
    "online shopping Bangladesh",
    "ecommerce Bangladesh",
    "fashion Bangladesh",
    "gadgets BD",
    "online store Bangladesh",
  ],

  openGraph: {
    title: "Ryor - Online Shopping in Bangladesh",
    description:
      "Discover fashion, beauty products, electronics, home essentials, gadgets and more at Ryor with fast delivery across Bangladesh.",
    url: "https://ryorbd.vercel.app",
    siteName: "Ryor",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ryor",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ryor - Online Shopping in Bangladesh",
    description:
      "Shop fashion, gadgets, beauty products and more with fast delivery across Bangladesh.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://buyfest.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>

            <NotificationBanner />

            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
