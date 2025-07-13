import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "./logo";
import { Analytics } from "@vercel/analytics/next"

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
      <body className="bg-background w-screen flex flex-col min-h-screen font-tfont font-bold">
        <Header />
        {children}
        <Footer />
        <Analytics/>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-foreground text-text font-hun flex p-2 justify-between items-baseline bg-[url(/res/header.png)]">
      <div className="flex gap-2 items-center">
        <Logo/>
        <Link className="text-5xl text-text-highlight mt-2" href="/">
          BnuuyMemes
        </Link>
      </div>

      <div>
        <p className="hidden md:block">By TitanPlayz</p>
      </div>
    </header>
  )
}

function Footer() {
  return <p className='text-text ml-10 m-2 opacity-50 mt-auto'>© BnuuySite 2025</p>
}
