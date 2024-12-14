/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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
      const token = localStorage.getItem("auth-token");

      const isUnprotectedRoute =
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/share");

      if (!token && !isUnprotectedRoute) {
        router.replace("/auth/login");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkSession();
  }, [router, pathname]);

  // if (isAuthenticated === null) {
  //   return <p>Loading...</p>;
  // }

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
