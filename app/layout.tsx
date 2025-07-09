import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bnuuy Site",
  description: "Created by titanplayz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background w-screen h-screen">
        <Header/>
        {children}
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-foreground text-text p-5 flex justify-between items-baseline">
      <Link className="text-5xl text-text-highlight" href="/">BnuuyMemes</Link>
      <div>
        <p>By TitanPlayz</p>
      </div>
    </header>
  )
}
