import type { Metadata } from "next";
import "./globals.css";
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
      <body className="bg-background w-screen flex flex-col min-h-screen font-tfont font-bold">
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-foreground text-text font-hun p-5 flex justify-between items-baseline bg-[url(/header.png)]">
      <Link className="text-5xl text-text-highlight" href="/">BnuuyMemes</Link>
      <div>
        <p className="hidden md:block">By TitanPlayz</p>
      </div>
    </header>
  )
}

function Footer() {
  return <p className='text-text ml-10 m-2 opacity-50 mt-auto'>© BnuuySite 2025</p>
}
