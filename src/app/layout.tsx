import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import "./home-v3.css";
import "./store.css";
import { StoreProvider } from "@/context/StoreContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shanya — Hair Accessories & Home Essentials | India",
  description:
    "Shop premium hair accessories, home essentials & kitchen products at Shanya. Free shipping on orders over ₹1000. Easy 30-day returns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
