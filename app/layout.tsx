import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Header from "./header";

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
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

function Footer() {
  return <p className='text-text ml-10 m-2 opacity-50 mt-auto'>© BnuuySite 2025</p>
}
