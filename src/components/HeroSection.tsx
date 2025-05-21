'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background to-purple-900/20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-primary">Optimize</span> Your Meta Lead Generation with Adverlead
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          Adverlead is your all-in-one platform to create, manage, analyze, and convert leads from your Facebook and Instagram campaigns. Stop juggling tools and start maximizing your ROI.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started for Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/how-it-works">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 