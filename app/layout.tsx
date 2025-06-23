import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
