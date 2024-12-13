import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 animate-fade-in">
            Build Dynamic Forms in Minutes
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 animate-fade-in-delay-1">
            Simplify data collection with drag-and-drop tools, real-time
            previews, and customizable themes.
          </p>
          <Link href={"/dashboard"}>
            <Button size="lg" className="animate-fade-in-delay-2">
              Get Started Now
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/black.jpg"
            alt="Form Builder in Action"
            width={800}
            height={600}
            className="rounded-lg shadow-2xl animate-float"
          />
        </div>
      </div>
    </section>
  );
}
