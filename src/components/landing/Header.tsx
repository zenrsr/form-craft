import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
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
          <Button variant="outline">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
