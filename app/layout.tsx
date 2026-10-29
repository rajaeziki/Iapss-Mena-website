import type { Metadata } from "next";
import { Inter, Fraunces, Cairo } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/Lang";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"] });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "IAPSS MENA | Regional voices. Global dialogue.",
    description: "The Middle East and North Africa Regional Chapter of the International Association for Political Science Students.",
    images: [{ url: "/img/hero.jpg", width: 1672, height: 941 }],
    siteName: "IAPSS MENA",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  title: { default: "IAPSS MENA | Political Science Students", template: "%s | IAPSS MENA" },
  description: "IAPSS MENA is the Middle East and North Africa regional chapter of the International Association for Political Science Students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} ${cairo.variable} font-sans`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
