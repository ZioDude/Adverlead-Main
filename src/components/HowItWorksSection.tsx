'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react'; // Using lucide-react for icons

const steps = [
  {
    id: 1,
    title: "Connect Your Meta Account",
    description: "Securely link your Facebook and Instagram ad accounts to Adverlead in just a few clicks. Our guided process makes it simple.",
    icon: <CheckCircle className="w-8 h-8 text-primary" />
  },
  {
    id: 2,
    title: "Create & Launch Campaigns",
    description: "Utilize our AI-powered campaign creator, choose from templates, or build from scratch. Define your audience, budget, and creatives with ease.",
    icon: <CheckCircle className="w-8 h-8 text-primary" />
  },
  {
    id: 3,
    title: "Manage Leads Effectively",
    description: "Track incoming leads in real-time. Our CRM features help you qualify, assign, and nurture leads towards conversion.",
    icon: <CheckCircle className="w-8 h-8 text-primary" />
  },
  {
    id: 4,
    title: "Analyze & Optimize",
    description: "Monitor key metrics through your dashboard. Gain insights to optimize ad spend, improve targeting, and boost your CPL and CPA.",
    icon: <CheckCircle className="w-8 h-8 text-primary" />
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How Adverlead Works</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            A simple, streamlined process to elevate your Meta lead generation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <Card key={step.id} className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  {step.icon}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 