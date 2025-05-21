'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";

const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    frequency: "/month",
    description: "For small businesses & solo advertisers getting started.",
    features: [
      "Up to 3 Connected Meta Accounts",
      "AI Campaign Creation (Basic)",
      "Lead Management (CRM Lite)",
      "Basic Analytics & Reporting",
      "Email Support"
    ],
    cta: "Choose Starter",
    href: "/signup?plan=starter",
    mostPopular: false
  },
  {
    name: "Pro",
    price: "$99",
    frequency: "/month",
    description: "For growing businesses looking to scale their lead generation.",
    features: [
      "Up to 10 Connected Meta Accounts",
      "AI Campaign Creation (Advanced)",
      "Full Lead Management (CRM)",
      "Advanced Analytics & Reporting",
      "Chatbot Integration (Basic)",
      "Priority Email & Chat Support"
    ],
    cta: "Choose Pro",
    href: "/signup?plan=pro",
    mostPopular: true
  },
  {
    name: "Scale",
    price: "$199",
    frequency: "/month",
    description: "For agencies and large teams needing comprehensive features.",
    features: [
      "Unlimited Connected Meta Accounts",
      "AI Campaign Creation (Premium)",
      "Advanced CRM & Automation",
      "Customizable Reporting & Dashboards",
      "Chatbot Integration (Advanced)",
      "Dedicated Account Manager",
      "API Access"
    ],
    cta: "Choose Scale",
    href: "/signup?plan=scale",
    mostPopular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
            Choose the plan that&apos;s right for your business. No hidden fees, cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={cn(
                "flex flex-col shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1",
                "bg-card/80 backdrop-blur-md",
                tier.mostPopular ? 'border-2 border-primary shadow-primary/40' : 'border-border'
              )}
            >
              {tier.mostPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-semibold">{tier.name}</CardTitle>
                <CardDescription className="text-muted-foreground h-12">{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.frequency}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button size="lg" className="w-full" variant={tier.mostPopular ? "default" : "outline"} asChild>
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12 text-muted-foreground">
          <p>Need a custom solution or have more questions? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.</p>
        </div>
      </div>
    </section>
  );
} 