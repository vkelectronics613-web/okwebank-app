import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { ThemeProvider } from "@/components/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OkweBank | The Digital Ledger",
  description: "Next-gen banking for the modern frontier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased transition-colors duration-300`}>
        <ThemeProvider>
            <div className="min-h-full flex flex-col bg-white dark:bg-black text-slate-900 dark:text-white">
                <main className="flex-1">
                    {children}
                </main>
                <BottomNav />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
