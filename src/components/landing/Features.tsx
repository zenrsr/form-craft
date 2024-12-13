"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropletsIcon as DragDropIcon,
  EyeIcon,
  PaletteIcon,
  BellIcon,
} from "lucide-react";

const features = [
  {
    icon: <DragDropIcon className="h-8 w-8 text-blue-500" />,
    title: "Drag-and-drop simplicity",
    description:
      "Create forms effortlessly with our intuitive drag-and-drop interface.",
  },
  {
    icon: <EyeIcon className="h-8 w-8 text-blue-500" />,
    title: "Real-time form preview",
    description: "See your changes instantly with our live preview feature.",
  },
  {
    icon: <PaletteIcon className="h-8 w-8 text-blue-500" />,
    title: "Customizable themes",
    description:
      "Choose from a variety of themes or create your own to match your brand.",
  },
  {
    icon: <BellIcon className="h-8 w-8 text-blue-500" />,
    title: "Advanced notifications",
    description:
      "Set up custom notifications for form submissions and user interactions.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="transition-transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {feature.icon}
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="md:hidden">
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              {features.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  Feature {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {features.map((feature, index) => (
              <TabsContent key={index} value={index.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {feature.icon}
                      <span>{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
