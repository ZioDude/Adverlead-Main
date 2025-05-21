'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuroraBackground } from "@/components/magicui/aurora-background";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { ArrowRight, Network } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <>
      <AuroraBackground showRadialGradient={true} />
      <section 
        className="relative z-0 container mx-auto px-4 py-16 md:py-24 flex flex-col justify-center min-h-[calc(100vh-80px)]"
      >
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 items-center">
          {/* Left Column: Text Content & CTAs */}
          <div className="text-center md:text-left">
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

          {/* Right Column: Visual with AnimatedGridPattern and Icon */}
          <div className="hidden md:flex justify-center items-center min-h-[300px]">
            <div className="relative w-full max-w-md h-80 bg-card/10 rounded-xl shadow-2xl border border-border/20 overflow-hidden flex items-center justify-center">
              <AnimatedGridPattern
                numSquares={12}
                maxOpacity={0.15}
                duration={4}
                className="absolute inset-0 h-full w-full [--grid-color:theme(colors.primary/0.3)]"
              />
              <Network className="h-32 w-32 text-primary/70 z-10" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 