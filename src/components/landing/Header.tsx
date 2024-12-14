"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          FormCraft
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            Log In
          </Button>
          <Button
            onClick={() => {
              router.push("/auth/signup");
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
