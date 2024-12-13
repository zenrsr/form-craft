import { Button } from "../ui/button";

export default function CallToAction() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Building Your Forms Today - It&apos;s Free!
        </h2>
        <p className="text-xl mb-8">
          Join thousands of users who are already creating amazing forms with
          FormCraft.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" variant="secondary">
            Get Started Now
          </Button>
          <Button size="lg" variant="outline">
            Log In
          </Button>
        </div>
      </div>
    </section>
  );
}
