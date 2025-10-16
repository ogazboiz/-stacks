import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

// This loads a nice font called Inter
const inter = Inter({ subsets: ["latin"] });

// Metadata = Info about your website (like a book cover!)
export const metadata: Metadata = {
  title: "Stacks Account History",
  description: "View your Stacks account history and transactions.",
};

// This is the WRAPPER for EVERYTHING on the website
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col gap-8 w-full">
          {/* The Navbar appears on EVERY page */}
          <Navbar />
          
          {/* This is where each page's unique content goes */}
          {children}
        </div>
      </body>
    </html>
  );
}