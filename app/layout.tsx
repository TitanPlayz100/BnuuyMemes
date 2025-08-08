import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Header from "./components/header/header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BnuuyMemes",
  description: "Memes from tetrio's bnuuy thread, Created by titanplayz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background w-screen flex flex-col min-h-screen font-tfont font-bold overflow-x-hidden">
        <Analytics />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <div className="text-text ml-10 m-2 opacity-50 mt-auto flex">
      <p>© BnuuySite 2025</p>
      <Link className="ml-auto hover:text-white" href="/info">Info | Contact</Link>
    </div>
  )
}
