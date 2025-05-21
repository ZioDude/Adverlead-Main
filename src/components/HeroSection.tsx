'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuroraBackground } from "@/components/magicui/aurora-background";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Globe from "@/components/magicui/globe";

export default function HeroSection() {
  return (
    <>
      <AuroraBackground showRadialGradient={true} />
      <section 
        className="relative px-4 py-16 md:py-24 flex flex-col justify-center min-h-[calc(100vh-80px)] overflow-x-hidden"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-10 items-center">
          {/* Left Column: Text Content & CTAs */}
          <div className="text-center md:text-left z-10">
            <AnimatedShinyText
              className={cn(
                "mb-2 text-lg inline-flex items-center justify-center md:justify-start",
                "text-accent"
              )}
            >
              ✨ Introducing Adverlead
            </AnimatedShinyText>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              <span className="text-primary">Optimize</span> Your Meta Lead Generation with Adverlead
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto md:mx-0">
              Adverlead is your all-in-one platform to create, manage, analyze, and convert leads from your Facebook and Instagram campaigns. Stop juggling tools and start maximizing your ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                asChild 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform transition-transform hover:scale-105 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
              >
                <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="border-foreground/30 hover:bg-muted/50 hover:border-primary text-foreground transform transition-transform hover:scale-105 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
              >
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Globe */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-[550px] h-[550px] rounded-full border border-primary/20 overflow-hidden">
              <Globe />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 