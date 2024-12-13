import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircleIcon,
  PaintbrushIcon as PaintBrushIcon,
  RocketIcon,
} from "lucide-react";

const steps = [
  {
    icon: <PlusCircleIcon className="h-12 w-12 text-blue-500" />,
    title: "Create",
    description: "Build forms with drag-and-drop tools",
  },
  {
    icon: <PaintBrushIcon className="h-12 w-12 text-blue-500" />,
    title: "Customize",
    description: "Apply themes and adjust settings",
  },
  {
    icon: <RocketIcon className="h-12 w-12 text-blue-500" />,
    title: "Deploy",
    description: "Share forms and collect responses",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="text-center transition-transform hover:scale-105"
            >
              <CardHeader>
                <div className="flex justify-center mb-4">{step.icon}</div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
