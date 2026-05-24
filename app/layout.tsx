import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── Font setup ────────────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--playfair-font",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--cormorant-font",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--jost-font",
  display: "swap",
});

// ── Root metadata ─────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lazycattrees.com"
  ),
  title: {
    template: "%s | LazyCat Trees",
    default: "LazyCat Trees — Handcrafted Natural Wood Cat Trees",
  },
  description:
    "Luxury handcrafted cat trees made from sustainably sourced natural wood. Each tree is custom-built to order in Cheyenne, Wyoming. 2–8 platforms, 14 carpet colors.",
  keywords: [
    "natural wood cat tree",
    "handcrafted cat tree",
    "luxury cat furniture",
    "custom cat tree",
    "reclaimed wood cat tree",
    "Cheyenne Wyoming",
    "LazyCat Trees",
  ],
  openGraph: {
    type: "website",
    siteName: "LazyCat Trees",
    title: "LazyCat Trees — Handcrafted Natural Wood Cat Trees",
    description:
      "Luxury handcrafted cat trees made from sustainably sourced natural wood. Custom-built to order in Cheyenne, Wyoming.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${jost.variable}`}
    >
      <body className="antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
