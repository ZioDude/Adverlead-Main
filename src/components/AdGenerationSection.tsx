'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, UploadCloud, ClipboardList } from 'lucide-react'; // Icons
import Link from "next/link";

const features = [
  {
    title: "AI-Powered Ad Creation",
    description: "Let our intelligent assistant craft compelling ad copy and suggest high-performing visuals based on your goals and audience.",
    icon: <Sparkles className="w-10 h-10 text-primary mb-4" />,
    link: "/features/ai-ads"
  },
  {
    title: "Rich Media Library",
    description: "Access a vast library of stock images and videos, or easily upload and manage your own brand assets.",
    icon: <UploadCloud className="w-10 h-10 text-primary mb-4" />,
    link: "/features/media-library"
  },
  {
    title: "Ad Previews & Templates",
    description: "Preview your ads across Facebook and Instagram placements. Start quickly with professionally designed ad templates.",
    icon: <ClipboardList className="w-10 h-10 text-primary mb-4" />,
    link: "/features/ad-templates"
  },
];

export default function AdGenerationSection() {
  return (
    <section id="ad-generation" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Generate Winning Ads, Effortlessly</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Create high-impact ad creatives that convert. Adverlead provides the tools and intelligence you need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-center md:justify-start">{feature.icon}</div>
                <CardTitle className="text-2xl mt-2 text-center md:text-left">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base text-center md:text-left">{feature.description}</CardDescription>
              </CardContent>
              <CardFooter className="justify-center md:justify-start">
                <Button variant="link" asChild className="text-primary hover:text-primary/80 px-0">
                  <Link href={feature.link}>Learn More <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/ad-generation">Explore Ad Generation Tools</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 