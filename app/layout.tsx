import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS by Rifki",
  description: "LMS by Rifki",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" className="h-full">
        <body className={(inter.className, "h-full")}>
          <div className="h-full">
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
