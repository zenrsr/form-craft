/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchSession } from "@/lib/supabaseSessionHelper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [_isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const session = await fetchSession();

      const isUnprotectedRoute =
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/share");

      if (!session.id && !isUnprotectedRoute) {
        router.replace("/auth/signup");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkSession();
  }, [router, pathname]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
