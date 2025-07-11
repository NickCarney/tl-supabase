import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devjock Test",
  description: "Devjock test project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="text-center py-4">
          <Link
            href="/"
            className="font-bold text-blue-400 hover:text-purple-400"
          >
            Devjock Test
          </Link>
        </header>

        {children}

        <footer>
          <div className="text-center">
            <p>
              <Link
                href="/queries/add"
                className="text-blue-400 hover:text-purple-400"
              >
                Add Query
              </Link>
            </p>
            <p>
              <Link
                href="/search"
                className="text-blue-400 hover:text-purple-400"
              >
                Search Queries
              </Link>
            </p>
            <p>
              <Link
                href="/chat"
                className="text-blue-400 hover:text-purple-400"
              >
                Chat with AI SDK
              </Link>
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
